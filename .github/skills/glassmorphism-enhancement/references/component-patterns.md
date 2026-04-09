# Component Patterns Reference

## Overview

This document provides reusable patterns for common component types in the JARVIS UI design system.

## Pattern: Glass Panel (Card/Container)

Used for: content containers, module screens, info cards

```tsx
<div
  className="
  bg-[rgba(10,15,28,0.7)]
  backdrop-blur-[16px]
  border border-white border-opacity-10
  rounded-[16px]
  p-6
  shadow-lg
  hover:border-white hover:border-opacity-20
  hover:bg-opacity-80
  transition-all duration-300
"
>
  {/* Content */}
</div>
```

## Pattern: Primary Action Button

Used for: submit, confirm, primary actions

```tsx
<button
  className="
  bg-[rgba(0,212,255,0.1)]
  border border-cyan-400
  text-cyan-400
  rounded-lg
  px-6 py-2
  shadow-[0_0_8px_rgba(0,212,255,0.4)]
  hover:shadow-[0_0_16px_rgba(0,212,255,0.7)]
  hover:scale-105
  hover:border-opacity-100
  focus:ring-2 focus:ring-cyan-300 focus:ring-opacity-50
  transition-all duration-300
  font-semibold
"
>
  Confirm
</button>
```

## Pattern: Secondary Button

Used for: cancel, back, secondary actions

```tsx
<button
  className="
  bg-[rgba(10,15,28,0.5)]
  border border-white border-opacity-20
  text-white
  rounded-lg
  px-6 py-2
  hover:bg-opacity-70
  hover:border-white hover:border-opacity-40
  hover:scale-103
  transition-all duration-300
"
>
  Cancel
</button>
```

## Pattern: Text Input

Used for: text fields, search boxes, form inputs

```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="
    w-full
    bg-[rgba(10,15,28,0.5)]
    backdrop-blur-[8px]
    border border-white border-opacity-10
    rounded-lg
    px-4 py-2
    text-white
    placeholder-gray-500
    focus:border-cyan-400 focus:border-opacity-100
    focus:outline-none
    focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30
    transition-all duration-300
  "
/>
```

## Pattern: Floating Menu

Used for: context menus, dropdowns, floating panels

```tsx
<div
  className="
  absolute
  bg-[rgba(10,15,28,0.85)]
  backdrop-blur-[20px]
  border border-cyan-400 border-opacity-30
  rounded-[12px]
  shadow-xl
  p-4
  z-50
  animate-fadeIn
"
>
  {/* Menu items */}
</div>
```

## Pattern: Icon Button (Minimal)

Used for: close, back, icon-only actions

```tsx
<button
  className="
  p-2
  text-white
  hover:text-cyan-400
  hover:bg-[rgba(0,212,255,0.1)]
  rounded-lg
  transition-all duration-200
"
>
  {icon}
</button>
```

## Pattern: Info Badge/Tag

Used for: labels, badges, status indicators

```tsx
<span
  className="
  bg-[rgba(0,212,255,0.15)]
  text-cyan-300
  px-3 py-1
  rounded-full
  text-sm
  border border-cyan-400 border-opacity-20
  font-medium
"
>
  Active
</span>
```

## Pattern: Scrollable Panel with Glass

Used for: lists, scrollable content areas

```tsx
<div
  className="
  max-h-96
  overflow-y-auto
  bg-[rgba(10,15,28,0.7)]
  backdrop-blur-[16px]
  border border-white border-opacity-10
  rounded-[12px]
  p-4
  space-y-2
  custom-scrollbar
"
>
  {/* List items */}
</div>
```

Add custom scrollbar styling to your CSS:

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.5);
}
```

## Pattern: Modal Overlay

Used for: dialogs, full-screen overlays

```tsx
<div
  className="
  fixed inset-0
  bg-black bg-opacity-50
  backdrop-blur-[4px]
  flex items-center justify-center
  z-50
"
>
  <div
    className="
    bg-[rgba(10,15,28,0.95)]
    backdrop-blur-[20px]
    border border-white border-opacity-10
    rounded-[20px]
    p-8
    max-w-lg
    shadow-2xl
  "
  >
    {/* Modal content */}
  </div>
</div>
```

## Pattern: Hover Glow Effect

Applied to interactive elements for emphasis:

```tsx
<div
  className="
  transition-all duration-300
  hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]
  hover:border-cyan-400
"
>
  {/* Interactive element */}
</div>
```

## Pattern: Animated Entrance

For new panels/modals appearing:

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
```

## Pattern: Focus State (Accessibility)

Ensure keyboard navigation is visible:

```tsx
<button
  className="
  focus:outline-none
  focus:ring-2
  focus:ring-cyan-400
  focus:ring-offset-2
  focus:ring-offset-[#0A0F1C]
  transition-all duration-300
"
>
  Keyboard accessible button
</button>
```

## Combining Patterns

Build complex components by layering patterns:

```tsx
<div className="bg-[#0A0F1C] min-h-screen p-6">
  {/* Glass Panel Pattern */}
  <div className="bg-[rgba(10,15,28,0.7)] backdrop-blur-[16px] border border-white border-opacity-10 rounded-[16px] p-6">
    {/* Content */}
    <h2 className="text-white text-xl mb-4">Module Title</h2>

    {/* Text Input Pattern */}
    <input className="w-full bg-[rgba(10,15,28,0.5)] backdrop-blur-[8px] border border-white border-opacity-10 rounded-lg px-4 py-2 text-white mb-4" />

    {/* Button Group */}
    <div className="flex gap-3">
      {/* Primary Button Pattern */}
      <button className="...primary button classes...">Confirm</button>
      {/* Secondary Button Pattern */}
      <button className="...secondary button classes...">Cancel</button>
    </div>
  </div>
</div>
```
