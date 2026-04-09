# Glassmorphism Enhancement — Quick Start Guide

## What This Skill Does

This skill provides complete guidance and reusable templates for enhancing your JARVIS frontend components with a consistent glassmorphism UI style. It gives you:

- **Design System**: Color palette, effects, and spacing standardized
- **Component Patterns**: Reusable Tailwind classes for cards, buttons, inputs, modals
- **Code Templates**: Ready-to-use React components for common UI patterns
- **Step-by-Step Procedures**: How to enhance existing components or create new ones

---

## 30-Second Setup

### 1. Understand the Color System

```
Base: #0A0F1C (dark navy)
Glass: rgba(10,15,28, 0.5–0.7)
Border: rgba(255,255,255, 0.1–0.2)
Accent: #00D4FF (cyan) or #0099FF (blue)
```

### 2. Basic Pattern

Every glassmorphism element follows this structure:

```tsx
<div
  className="
  bg-[rgba(10,15,28,0.7)]    // Glass layer
  backdrop-blur-[16px]       // Blur effect
  border border-white        // Subtle border
  border-opacity-10
  rounded-[16px]             // Rounded corners
  p-6                        // Padding
  hover:border-opacity-20    // Interactive state
  transition-all duration-300 // Smooth animation
"
>
  {/* Your content */}
</div>
```

### 3. Quick Actions

**To enhance an existing component:**

1. Find the element (card, button, input)
2. Copy the appropriate pattern from [Component Patterns](./references/component-patterns.md)
3. Replace the className
4. Test hover/focus states

**To create a new component:**

1. Pick a template from `./assets/` (button, panel, input, etc.)
2. Copy the code
3. Customize the content inside
4. Adjust sizing/spacing as needed

---

## File Structure

```
.github/skills/glassmorphism-enhancement/
├── SKILL.md                          # Main skill documentation
├── references/
│   └── component-patterns.md         # All reusable patterns
└── assets/
    ├── glass-panel-template.tsx      # Panel/card components
    ├── button-template.tsx           # Button variations
    ├── input-template.tsx            # Form element components
    └── module-screen-enhanced.tsx    # Complete example
```

---

## Common Tasks

### Task: Enhance a Card Component

**Before:**

```tsx
<div className="border p-4">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

**After (using GlassPanel template):**

```tsx
import { GlassPanel } from "./assets/glass-panel-template";

<GlassPanel header="Title" className="p-4">
  <p>Content</p>
</GlassPanel>;
```

### Task: Add a Primary Action Button

**Use PrimaryButton:**

```tsx
import { PrimaryButton } from "./assets/button-template";

<PrimaryButton onClick={handleConfirm}>Confirm</PrimaryButton>;
```

Features included automatically:

- Cyan glow effect
- Scale on hover (1.05x)
- Focus ring for accessibility
- Smooth transition (300ms)

### Task: Style a Form Input

**Use TextInput template:**

```tsx
import { TextInput, FormGroup } from "./assets/input-template";

<FormGroup label="Email" required>
  <TextInput
    type="email"
    placeholder="your@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    errorMessage={error}
  />
</FormGroup>;
```

Features:

- Glass background with focus state
- Cyan focus ring
- Error display
- Optional icon

### Task: Create a Modal

**Use FloatingGlassPanel:**

```tsx
import { FloatingGlassPanel } from "./assets/glass-panel-template";

<FloatingGlassPanel isOpen={true} onClose={close} title="Confirm">
  <p>Are you sure?</p>
</FloatingGlassPanel>;
```

### Task: Ensure Consistency

**Validation checklist:**

- [ ] Background uses `#0A0F1C` or `rgba(10,15,28,x)`
- [ ] Backdrop blur is 12px–24px
- [ ] Border is white with 0.1–0.2 opacity
- [ ] Cyan accent (#00D4FF) on interactive areas
- [ ] Transitions are 200–400ms
- [ ] Hover scales 1.03–1.05

---

## Real-World Example

**Styling HexMenu.tsx to focus glow:**

Current (from your repo):

```tsx
<Line points={points} closed fill="#0A0F1C" stroke="#00D4FF" strokeWidth={2} />
```

Add interactive effect:

```tsx
<Line
  points={points}
  closed
  fill="#0A0F1C"
  stroke="#00D4FF"
  strokeWidth={2}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
  shadowColor={hover ? "#00D4FF" : "transparent"}
  shadowBlur={hover ? 12 : 0}
  opacity={hover ? 1 : 0.8}
/>
```

Or with CSS classes:

```tsx
<div
  className="
  border-2 border-cyan-400
  hover:shadow-[0_0_16px_rgba(0,212,255,0.7)]
  transition-all duration-300
"
>
  {/* Tile content */}
</div>
```

---

## Key Principles

1. **Consistency**: Use the same color values, blur amounts, and transition durations across all components
2. **Hierarchy**: Primary actions get stronger glow; secondary actions are more subtle
3. **Transparency**: Glass layers should feel layered, not solid
4. **Motion**: All interactive effects should animate smoothly (300–400ms)
5. **Contrast**: Text should always contrast with the background; cyan is for accents

---

## Next Steps

1. **Review [Component Patterns](./references/component-patterns.md)** for all available patterns
2. **Copy templates** from `./assets/` for your components
3. **Apply the pattern** to your existing UI
4. **Test in context** — does it look good alongside other enhanced components?
5. **Iterate** — refine colors/effects to match your vision

---

## Troubleshooting

**Q: My border is too visible/invisible**
A: Adjust `border-opacity-10` to `border-opacity-20` (or lower for less visibility)

**Q: Glow effect isn't showing**
A: Ensure the shadow value is correct: `shadow-[0_0_12px_rgba(0,212,255,0.5)]`

**Q: Transitions feel sluggish**
A: Use `duration-300` (300ms) for most interactions; 200ms for quick feedback

**Q: Cyan doesn't pop enough**
A: Increase the glow blur from 12px to 16px, or increase shadow opacity

---

## Related Documentation

- **SKILL.md** — Full feature documentation
- **Component Patterns** — Reference for all reusable patterns
- **Template Files** — Copy-paste ready components
- **Example Screen** — Complete module screen showing all patterns together
