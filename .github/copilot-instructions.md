# GitHub Copilot Instructions -- JARVIS UI (Phase 2)

## Project Context

This project is a personal desktop assistant called **JARVIS**, built
using **Electron + HTML/CSS/JavaScript**.

The UI currently consists of:

- A **hexagonal control wheel**
- **6 clickable tiles (SVG polygons)**
- A **center AI circle**
- The UI runs inside an **Electron transparent window**

The hex wheel acts as a **navigation interface**.

Each tile represents a feature module.

Current modules: 1 → Website shortcuts\
2 → Weather forecast\
3 → Quick notes\
4 → System status\
5 → Reserved\
6 → Reserved

The center circle represents the **AI core**.

---

# Desired UI Behavior

When the user clicks **any tile OR the center AI circle**:

The hexagonal interface should **transition into a rectangular panel**.

The rectangle should:

- Have **rounded corners**
- Appear in the **same position as the hex**
- Expand smoothly with an **animation**
- Hide the hex UI during the transition

The rectangle will act as a **content container** for modules.

For now, the rectangle should be **empty**.

Content will be added later.

---

# Rectangle Panel Requirements

The rectangle panel should have:

- Rounded corners
- Dark translucent background
- Cyan border (matching the hex theme)
- Subtle futuristic style

Example styling inspiration:

    background: rgba(10,20,25,0.9)
    border: 1px solid cyan
    border-radius: 20px

The rectangle should contain:

### Back Button

A **back arrow button** at the **top-left corner**.

When clicked:

- The rectangle should **collapse**
- The hex UI should **reappear**
- Reverse the animation

---

# Animation Requirements

Use smooth animations such as:

- CSS transitions
- transform: scale()
- opacity
- clip-path
- or width/height expansion

The transition should feel like:

HEXAGON → MORPH → RECTANGLE

Target animation duration:

200ms -- 350ms

Animation must feel **fluid and futuristic**.

---

# Interaction Rules

Clicking the following should trigger the rectangle expansion:

- tile1
- tile2
- tile3
- tile4
- tile5
- tile6
- AI core circle

The system should:

hide hex UI → show rectangle panel → animate transition

---

# UI Structure

Expected DOM structure:

container ├─ hex-ui │ ├─ svg hex wheel │ ├─ tiles │ └─ AI circle │ └─
rectangle-panel ├─ back-button └─ content-area

---

# Rectangle Panel Layout

+-----------------------------------+
| ← Back |
| |
| Content Area |
+-----------------------------------+

Content area should be **empty for now**.

---

# Back Button Behavior

Clicking the back arrow should:

hide rectangle → show hex UI → play reverse animation

The back button should **not drag the Electron window**.

Use:

-webkit-app-region: no-drag

---

# Electron Window Constraints

Because this runs inside Electron:

- The window should remain **draggable**
- Interactive elements must use:

-webkit-app-region: no-drag

---

# Code Style Preferences

Prefer:

- clean modular JavaScript
- readable CSS classes
- minimal dependencies
- no heavy frameworks for this step

Avoid:

- large UI libraries
- complex animation libraries

Use native CSS where possible.

---

# Future Compatibility

The rectangle panel will later host:

- weather module
- quick notes module
- system monitor
- website launcher

Therefore the content area should be structured like:

::: panel-content
:::

so dynamic content can be injected later.

---

# Expected Result

Initial state: HEXAGON UI

User clicks tile: HEX → animation → RECTANGLE PANEL

User clicks back arrow: RECTANGLE → animation → HEX

---

# Visual Style

The entire UI should follow a **futuristic HUD theme**:

- cyan accent color
- dark translucent background
- soft glow effects
- minimalistic controls
