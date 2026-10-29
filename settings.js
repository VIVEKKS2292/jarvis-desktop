const { app, safeStorage } = require("electron");
const fs = require("fs");
const path = require("path");

const KNOWN_PROVIDERS = ["gemini"];

const DEFAULTS = {
  version: 1,
  provider: "gemini",
  // Free-text in Settings. Verify against the provider's current model list.
  model: "gemini-2.5-flash",
  hotkey: "Control+Shift+Space",
  launchAtLogin: false,
  keys: {}, // provider -> base64 ciphertext (never sent to the renderer)
};

const settingsFile = () => path.join(app.getPath("userData"), "settings.json");

async function writeJsonAtomic(file, data) {
  const tmp = file + ".tmp";
  await fs.promises.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.promises.rename(tmp, file);
}

let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = JSON.parse(fs.readFileSync(settingsFile(), "utf8"));
    cache = { ...DEFAULTS, ...raw, keys: { ...(raw.keys || {}) } };
  } catch {
    cache = { ...DEFAULTS, keys: {} };
  }
  return cache;
}

// Serialize writes so two quick updates can't interleave on the .tmp file.
let writeQueue = Promise.resolve();
function save() {
  writeQueue = writeQueue.then(() => writeJsonAtomic(settingsFile(), load()));
  return writeQueue;
}

function secureInfo() {
  let available = false;
  try {
    available = safeStorage.isEncryptionAvailable();
  } catch {}
  let weak = false;
  // Linux only: "basic_text" means no real keychain/keyring is in use.
  if (
    available &&
    typeof safeStorage.getSelectedStorageBackend === "function"
  ) {
    try {
      weak = safeStorage.getSelectedStorageBackend() === "basic_text";
    } catch {}
  }
  return { available, weak };
}

// Everything the renderer is allowed to see. No key material.
function publicView() {
  const { keys, ...rest } = load();
  return {
    ...rest,
    providers: KNOWN_PROVIDERS,
    hasKey: Object.fromEntries(Object.keys(keys).map((k) => [k, true])),
    secure: secureInfo(),
  };
}

// Whitelist + validate a patch coming from the renderer.
function sanitize(patch) {
  const out = {};
  if (!patch || typeof patch !== "object") return out;
  if (KNOWN_PROVIDERS.includes(patch.provider)) out.provider = patch.provider;
  if (
    typeof patch.model === "string" &&
    /^[\w.\-:/]{1,100}$/.test(patch.model.trim())
  )
    out.model = patch.model.trim();
  if (
    typeof patch.hotkey === "string" &&
    /^[A-Za-z0-9+]{1,50}$/.test(patch.hotkey)
  )
    out.hotkey = patch.hotkey;
  if (typeof patch.launchAtLogin === "boolean")
    out.launchAtLogin = patch.launchAtLogin;
  return out;
}

async function update(clean) {
  Object.assign(load(), clean);
  await save();
}

async function setKey(provider, plain) {
  if (!KNOWN_PROVIDERS.includes(provider)) throw new Error("Unknown provider");
  if (
    typeof plain !== "string" ||
    plain.trim().length < 8 ||
    plain.length > 500
  )
    throw new Error("That doesn't look like a valid API key");
  if (!secureInfo().available)
    throw new Error("Secure storage is not available on this system");
  load().keys[provider] = safeStorage
    .encryptString(plain.trim())
    .toString("base64");
  await save();
}

async function clearKey(provider) {
  if (!KNOWN_PROVIDERS.includes(provider)) return;
  delete load().keys[provider];
  await save();
}

function getKey(provider) {
  const b64 = load().keys[provider];
  if (!b64) return null;
  try {
    return safeStorage.decryptString(Buffer.from(b64, "base64"));
  } catch {
    return null; // e.g. profile moved to another machine/user: treat as "no key"
  }
}

module.exports = {
  KNOWN_PROVIDERS,
  load,
  publicView,
  sanitize,
  update,
  setKey,
  clearKey,
  getKey,
  writeJsonAtomic,
};
