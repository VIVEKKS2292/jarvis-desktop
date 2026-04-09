---
name: glassmorphism-enhancement
description: "Apply consistent glassmorphism (JARVIS-style) UI to frontend components using #0A0F1C base color with frosted glass panels, backdrop blur, and neon cyan accents. Use when: enhancing component styling, creating new panel components, implementing futuristic UI effects, or ensuring visual consistency across the renderer."
argument-hint: 'Component name or styling scope (e.g., "update ModuleScreen", "enhance all cards")'
---

# Glassmorphism Enhancement for JARVIS UI

## Overview

This skill provides guidelines, patterns, and reusable templates for applying a consistent **JARVIS-style glassmorphism** UI across all frontend components. The design achieves a futuristic AI assistant aesthetic using frosted glass panels, backdrop blur effects, and neon cyan/blue accents over a dark #0A0F1C base.

## When to Use

- **Styling existing components** for visual consistency
- **Creating new panel/card components** that integrate with the JARVIS theme
- **Implementing hover effects and interactions** with glow and scale animations
- **Ensuring dark mode compliance** across all UI elements
- **Adding transparency and blur effects** for depth perception

## Core Design System

### Color Palette

| Purpose               | Color                   | Usage                     |
| --------------------- | ----------------------- | ------------------------- |
| **Primary Base**      | `#0A0F1C`               | Background, base color    |
| **Glass Layer (70%)** | `rgba(10,15,28,0.7)`    | Opaque glass panels       |
| **Glass Layer (50%)** | `rgba(10,15,28,0.5)`    | Semi-transparent overlays |
| **Border**            | `rgba(255,255,255,0.1)` | Subtle dividers           |
| **Border (Hover)**    | `rgba(255,255,255,0.2)` | Emphasis on interaction   |
| **Accent**            | `#00D4FF`               | Primary cyan glow         |
| **Accent Alt**        | `#0099FF`               | Secondary blue            |

### Effects Configuration

| Effect             | Value            | Purpose              |
| ------------------ | ---------------- | -------------------- |
| **Backdrop Blur**  | `12px–24px`      | Glass depth          |
| **Transition**     | `0.2s–0.4s ease` | Smooth animations    |
| **Border Radius**  | `12px–20px`      | Rounded glass panels |
| **Glow Spread**    | `4px–12px blur`  | Neon effect          |
| **Scale on Hover** | `1.03–1.05`      | Interactive feedback |

## Step-by-Step Enhancement Procedure

### 1. Identify Component Type

Determine which category your component falls into:

- **Cards/Panels**: Static containers with content
- **Buttons**: Interactive controls
- **Inputs/Selects**: Form elements
- **Modals/Dialogs**: Full-screen or overlay containers
- **Navigation**: Menu/sidebar components

### 2. Apply Base Glass Panel Styling

Use the [Glass Panel Template](./assets/glass-panel-template.tsx) as a starting point:

```tsx
// Base glassmorphism container
className="bg-[#0A0F1C] bg-opacity-70 backdrop-blur-[12px]
           border border-white border-opacity-10 rounded-[12px]
           p-4 shadow-lg"
```

### 3. Add Interactive Effects

For interactive elements (buttons, clickable panels):

- Add `transition-all duration-300` for smooth animation
- Apply hover state: `hover:border-white hover:border-opacity-20 hover:bg-opacity-80`
- Include scale effect: `hover:scale-105`
- Add glow on focus: `focus:ring-2 focus:ring-cyan-400`

### 4. Implement Neon Accents

Apply cyan glow to emphasize interactive areas:

- Use `shadow-[0_0_12px_rgba(0,212,255,0.5)]` for glow
- Combine with color: `text-cyan-400` or `border-cyan-400`
- Apply on hover/focus states

### 5. Ensure Consistency Across Similar Components

Check that all components of the same type (e.g., all cards) follow the same pattern from [Component Patterns](./references/component-patterns.md).

---

## Component-Specific Patterns

### Panels & Cards

```tsx
// Enhanced component with glassmorphism
<div
  className="
  bg-[rgba(10,15,28,0.7)] 
  backdrop-blur-[16px]
  border border-white border-opacity-10
  rounded-[16px]
  p-6
  hover:border-white hover:border-opacity-20
  hover:bg-opacity-80
  transition-all duration-300
  shadow-lg
"
>
  {/* Content */}
</div>
```

### Buttons

```tsx
<button
  className="
  bg-[rgba(10,15,28,0.6)]
  border border-cyan-400 border-opacity-70
  rounded-lg
  px-4 py-2
  text-cyan-400
  shadow-[0_0_8px_rgba(0,212,255,0.4)]
  hover:shadow-[0_0_16px_rgba(0,212,255,0.6)]
  hover:border-opacity-100
  hover:scale-105
  transition-all duration-300
  font-medium
"
>
  Action
</button>
```

### Inputs & Selects

```tsx
<input
  className="
  bg-[rgba(10,15,28,0.5)]
  backdrop-blur-[8px]
  border border-white border-opacity-10
  rounded-lg
  px-3 py-2
  text-white
  placeholder-gray-500
  focus:border-cyan-400
  focus:ring-2 ring-cyan-400 ring-opacity-30
  focus:bg-opacity-70
  transition-all duration-300
"
/>
```

---

## Implementation Workflow

### Phase 1: Analysis

1. List all components in the renderer
2. Categorize by type (panel, button, input, etc.)
3. Document current styling approach

### Phase 2: Template Creation

1. Use [Glass Panel Template](./assets/glass-panel-template.tsx) for cards
2. Use [Button Template](./assets/button-template.tsx) for interactive controls
3. Use [Input Template](./assets/input-template.tsx) for form fields

### Phase 3: Component Enhancement

1. Update className attributes with glassmorphism patterns
2. Add transition and hover effects
3. Integrate neon cyan accents
4. Test hover/focus states

### Phase 4: Validation

1. Verify #0A0F1C base color applied
2. Check backdrop blur consistency (12px–24px)
3. Confirm border opacity (0.1–0.2)
4. Validate transition duration (0.2s–0.4s)
5. Test all interactive states

---

## Tailwind Configuration

Ensure your `tailwind.config.ts` includes the custom colors and effects:

```ts
theme: {
  extend: {
    colors: {
      jarvis: {
        base: '#0A0F1C',
        glass70: 'rgba(10,15,28,0.7)',
        glass50: 'rgba(10,15,28,0.5)',
      },
      cyan: {
        400: '#00D4FF',
      },
    },
    backdropBlur: {
      'jarvis': '16px',
    },
  },
}
```

---

## Common Patterns & Troubleshooting

See [Component Patterns Reference](./references/component-patterns.md) for:

- Card with icon and title
- Floating panel with close button
- Animated entrance transition
- Tooltip with glass effect
- Modal overlay with backdrop
- Navigation menu styling

---

## Examples & Templates

- **[Glass Panel Template](./assets/glass-panel-template.tsx)** — Base component for cards and containers
- **[Button Template](./assets/button-template.tsx)** — Interactive button with glow effects
- **[Input Template](./assets/input-template.tsx)** — Form input with glass styling
- **[Module Screen Enhancement](./assets/module-screen-enhanced.tsx)** — Full-page panel example

---

## Validation Checklist

Before considering a component complete:

- [ ] Uses `#0A0F1C` or `rgba(10,15,28,x)` for background
- [ ] Has `backdrop-blur-[12px]` to `backdrop-blur-[24px]`
- [ ] Border is `border-white border-opacity-10` or `border-opacity-20`
- [ ] Hover state includes opacity/scale change
- [ ] Transitions use `duration-300` or similar
- [ ] Cyan accent (`#00D4FF`) applied to interactive areas
- [ ] No conflicting inline styles overriding Tailwind classes
- [ ] Tested in dark environment (transparent to black background)
