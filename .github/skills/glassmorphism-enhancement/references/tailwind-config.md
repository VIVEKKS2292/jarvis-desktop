# Tailwind Configuration for Glassmorphism

This document provides the recommended Tailwind CSS configuration to support the glassmorphism design system.

## Recommended `tailwind.config.ts`

Add the following to your Tailwind configuration:

```typescript
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./renderer/index.html", "./renderer/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // JARVIS color system
        jarvis: {
          base: "#0A0F1C",
          "glass-70": "rgba(10, 15, 28, 0.7)",
          "glass-50": "rgba(10, 15, 28, 0.5)",
          "glass-30": "rgba(10, 15, 28, 0.3)",
        },
        // Cyan accent (primary)
        cyan: {
          "300": "#00E6FF",
          "400": "#00D4FF",
          "500": "#00B8D4",
        },
        // Blue accent (secondary)
        blue: {
          "400": "#0099FF",
          "500": "#0077CC",
        },
      },
      backgroundColor: {
        // Quick access to glass colors
        glass: {
          light: "rgba(10, 15, 28, 0.5)",
          medium: "rgba(10, 15, 28, 0.7)",
          dark: "rgba(10, 15, 28, 0.9)",
        },
      },
      backdropBlur: {
        // Glass effect blur amounts
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        jarvis: "16px",
      },
      fontSize: {
        // Consistent typography
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
      },
      spacing: {
        // JARVIS-standard spacing scale
        ...defaultTheme.spacing,
      },
      borderRadius: {
        // Rounded corner sizes
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        // Glow effects
        "glow-xs": "0 0 4px rgba(0, 212, 255, 0.3)",
        "glow-sm": "0 0 8px rgba(0, 212, 255, 0.4)",
        glow: "0 0 12px rgba(0, 212, 255, 0.5)",
        "glow-lg": "0 0 16px rgba(0, 212, 255, 0.6)",
        "glow-xl": "0 0 20px rgba(0, 212, 255, 0.7)",
        "glow-blue": "0 0 12px rgba(0, 153, 255, 0.5)",
      },
      transitionDuration: {
        // Animation durations
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
      },
      transitionTimingFunction: {
        // Easing functions
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-in-out": "cubic-bezier(0.4, 0, 0.6, 1)",
      },
      keyframes: {
        // Custom animations
        "slide-in": {
          from: {
            opacity: "0",
            transform: "translate(0, 20px)",
          },
          to: {
            opacity: "1",
            transform: "translate(0, 0)",
          },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(0, 212, 255, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 16px rgba(0, 212, 255, 0.7)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

## Key Configuration Points

### 1. Color System

The configuration defines JARVIS-specific colors for easy access:

```tsx
// Use in components
<div className="bg-jarvis-base"> {/* #0A0F1C */}
<div className="bg-glass-medium"> {/* rgba(10,15,28,0.7) */}
<div className="text-cyan-400"> {/* #00D4FF */}
```

### 2. Backdrop Blur

Pre-configured blur values for glass effect:

```tsx
<div className="backdrop-blur-md"> {/* 12px */}
<div className="backdrop-blur-lg"> {/* 16px */}
<div className="backdrop-blur-2xl"> {/* 24px */}
```

### 3. Glow Shadows

Predefined cyan/blue glow effects:

```tsx
<button className="shadow-glow hover:shadow-glow-lg">
```

### 4. Animations

Smooth entrance and pulse animations:

```tsx
<div className="animate-slide-in"> {/* Entrance animation */}
<div className="animate-pulse-glow"> {/* Pulsing glow */}
```

### 5. Transition Settings

Standardized timing for smooth interactions:

```tsx
<div className="transition-all duration-300"> {/* 300ms smooth */}
<div className="transition-all duration-500 ease-smooth"> {/* Custom timing */}
```

---

## Quick Reference: Common Class Names

### Background & Glass

| Class             | Color                |
| ----------------- | -------------------- |
| `bg-jarvis-base`  | `#0A0F1C` (solid)    |
| `bg-glass-light`  | `rgba(10,15,28,0.5)` |
| `bg-glass-medium` | `rgba(10,15,28,0.7)` |
| `bg-glass-dark`   | `rgba(10,15,28,0.9)` |

### Text Colors

| Class           | Color              |
| --------------- | ------------------ |
| `text-white`    | White (default)    |
| `text-cyan-400` | `#00D4FF` (accent) |
| `text-gray-300` | Light gray         |
| `text-gray-500` | Medium gray        |

### Borders

| Class                                   | Effect  |
| --------------------------------------- | ------- |
| `border border-white border-opacity-10` | Subtle  |
| `border border-white border-opacity-20` | Visible |
| `border border-cyan-400`                | Accent  |

### Blur & Effects

| Class               | Value |
| ------------------- | ----- |
| `backdrop-blur-sm`  | 8px   |
| `backdrop-blur-md`  | 12px  |
| `backdrop-blur-lg`  | 16px  |
| `backdrop-blur-xl`  | 20px  |
| `backdrop-blur-2xl` | 24px  |

### Shadows & Glow

| Class              | Effect                 |
| ------------------ | ---------------------- |
| `shadow-glow-xs`   | Subtle cyan glow       |
| `shadow-glow`      | Medium cyan glow       |
| `shadow-glow-lg`   | Strong cyan glow       |
| `shadow-glow-xl`   | Extra strong cyan glow |
| `shadow-glow-blue` | Blue glow variant      |

### Rounded Corners

| Class        | Size |
| ------------ | ---- |
| `rounded-sm` | 8px  |
| `rounded-md` | 12px |
| `rounded-lg` | 16px |
| `rounded-xl` | 20px |

### Transitions

| Class          | Duration         |
| -------------- | ---------------- |
| `duration-200` | 200ms (quick)    |
| `duration-300` | 300ms (standard) |
| `duration-400` | 400ms (smooth)   |
| `duration-500` | 500ms (slow)     |

### Animations

| Class                | Effect                   |
| -------------------- | ------------------------ |
| `animate-slide-in`   | Entrance slide animation |
| `animate-fade-in`    | Fade entrance            |
| `animate-pulse-glow` | Pulsing glow loop        |

---

## Example Usage in JSX

```tsx
// Complete button using configured classes
<button className="
  bg-glass-medium
  border border-cyan-400
  text-cyan-400
  rounded-lg
  px-6 py-2
  shadow-glow
  hover:shadow-glow-lg
  hover:scale-105
  transition-all duration-300
  font-semibold
">
  Confirm
</button>

// Glass panel
<div className="
  bg-glass-medium
  backdrop-blur-lg
  border border-white border-opacity-10
  rounded-xl
  p-6
  shadow-lg
  hover:border-opacity-20
  hover:bg-opacity-80
  transition-all duration-300
">
  {/* Content */}
</div>

// Input with animation
<input
  className="
    w-full
    bg-glass-light
    backdrop-blur-sm
    border border-white border-opacity-10
    rounded-lg
    px-4 py-2
    text-white
    focus:border-cyan-400
    focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30
    focus:outline-none
    transition-all duration-300
  "
/>

// Animated entrance
<div className="animate-slide-in space-y-4">
  {/* Content animates in */}
</div>
```

---

## Verifying Configuration

To verify your Tailwind configuration is correct:

1. **Build your project**: `npm run build`
2. **Check that all JARVIS classes compile** without warnings
3. **Test hover states** in the browser dev tools
4. **Check animations** work smoothly (60 FPS)

---

## Common Customizations

### Adjust Cyan Color

To use a different shade of cyan:

```typescript
colors: {
  cyan: {
    // Custom cyan (e.g., warmer)
    '400': '#00E8FF',
  }
}
```

### Add More Glow Variations

```typescript
boxShadow: {
  'glow-green': '0 0 12px rgba(0, 255, 136, 0.5)',
  'glow-red': '0 0 12px rgba(255, 100, 100, 0.5)',
}
```

### Customize Animation Speed

```typescript
animation: {
  'slide-in': 'slide-in 0.5s ease-out', // Slower entrance
}
```

---

## Browser Support

This configuration works in all modern browsers (Chrome, Firefox, Safari, Edge).

For older browsers that don't support `backdrop-filter`, add a fallback:

```tsx
<div
  className="
  bg-glass-medium
  backdrop-blur-lg
  [&::before]:content-['']
  [&::before]:absolute
  [&::before]:inset-0
  [&::before]:bg-jarvis-base
  [&::before]:opacity-70
"
>
  {/* Fallback to solid background for old browsers */}
</div>
```
