# ZplitGPT Styling Guide

A comprehensive guide to the design system, styling patterns, and visual language used in ZplitGPT.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Patterns](#component-patterns)
- [Interactive States](#interactive-states)
- [Animation & Transitions](#animation--transitions)
- [Neomorphic Design](#neomorphic-design)
- [Responsive Design](#responsive-design)
- [Dark Theme](#dark-theme)

---

## Color Palette

### Primary Colors
```css
/* Brand/Accent Colors */
--brand-primary: #ff4f2b;    /* ZplitGPT Orange */
--brand-hover: #ff6b4a;       /* Lighter orange */
--brand-success: #4aff4a;      /* Green for success states */

/* Model Brand Colors */
--openai-color: #10a37f;
--anthropic-color: #d97757;
--google-color: #4285f4;
--meta-color: #0668e1;
--mistral-color: #ff7000;
--qwen-color: #ff6a00;
--xai-color: #000000;
--perplexity-color: #20808d;
--zhipu-color: #5b8def;
--deepseek-color: #1a56db;
--moonshot-color: #6e45e2;
--amazon-color: #ff9900;
--nous-color: #8b5cf6;
--cerebras-color: #00d4ff;
```

### Background Colors
```css
/* Main Backgrounds */
--bg-primary: #000000;        /* Main app background */
--bg-secondary: #0a0a0a;      /* Component backgrounds */
--bg-tertiary: #111111;       /* Input/panel backgrounds */
--bg-quaternary: #1a1a1a;    /* Hover states, borders */

/* Overlay/Modal */
--bg-overlay: rgba(0, 0, 0, 0.5);
--bg-modal: #0a0a0a;
```

### Text Colors
```css
/* Primary Text */
--text-primary: #f5f5f5;       /* Main text */
--text-secondary: #b3b3b3;     /* Secondary text */
--text-muted: #666666;         /* Muted/disabled text */
--text-placeholder: #666666;    /* Input placeholders */

/* Status Colors */
--text-success: #4aff4a;
--text-error: #ff4f2b;
--text-warning: #ff6b4a;
```

### Border Colors
```css
--border-primary: #1a1a1a;      /* Main borders */
--border-secondary: #333333;     /* Input borders */
--border-hover: #2a2a2a;       /* Hover borders */
--border-focus: #ff4f2b;        /* Focus borders */
```

---

## Typography

### Font Families
```css
/* Primary Fonts */
--font-sans: 'Geist', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
--font-display: 'Satoshi', sans-serif;  /* For headings/display */

/* Custom Fonts */
--font-editors: 'Editors Note', sans-serif;
--font-satoshi: 'Satoshi', sans-serif;
```

### Font Sizes
```css
/* Text Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

---

## Spacing & Layout

### Spacing Scale
```css
/* 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Layout Dimensions
```css
/* Sidebar */
--sidebar-width: 256px;
--sidebar-width-collapsed: 64px;
--sidebar-width-icon: 64px;

/* Component Heights */
--header-height: 60px;
--input-height: 40px;
--button-height-sm: 30px;
--button-height: 36px;
--button-height-lg: 40px;

/* Border Radius */
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;
```

---

## Component Patterns

### Buttons
```css
/* Primary Button */
.btn-primary {
  background-color: var(--brand-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 200ms ease;
}

.btn-primary:hover {
  background-color: var(--brand-hover);
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all 200ms ease;
}

.btn-ghost:hover {
  background-color: var(--bg-quaternary);
  color: var(--text-primary);
}

/* Small Button */
.btn-sm {
  height: var(--button-height-sm);
  padding: 0 var(--space-2);
  font-size: var(--text-xs);
}
```

### Inputs
```css
/* Text Input */
.input {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  color: var(--text-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  transition: all 200ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(255, 79, 43, 0.1);
}

.input::placeholder {
  color: var(--text-placeholder);
}
```

### Cards/Panels
```css
/* Card Base */
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

/* Model Column */
.model-column {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 
    2px 2px 4px rgba(0, 0, 0, 0.3),
    -2px -2px 4px rgba(20, 20, 20, 0.3),
    inset 2px 2px 4px rgba(5, 5, 5, 0.3),
    inset -2px -2px 4px rgba(15, 15, 15, 0.2);
}
```

---

## Interactive States

### Hover States
```css
/* Standard Hover */
.hover-standard:hover {
  background-color: var(--bg-quaternary);
  border-color: var(--border-hover);
}

/* Brand Hover */
.hover-brand:hover {
  background-color: var(--brand-primary);
  color: white;
}

/* Subtle Hover */
.hover-subtle:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}
```

### Focus States
```css
/* Focus Ring */
.focus-standard:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 79, 43, 0.2);
}

.focus-brand:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(255, 79, 43, 0.1);
}
```

### Active States
```css
/* Active Button */
.btn-active:active {
  transform: scale(0.98);
}

/* Active Menu Item */
.menu-item-active {
  background-color: var(--bg-quaternary);
  border-left: 3px solid var(--brand-primary);
}
```

### Disabled States
```css
/* Disabled */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## Animation & Transitions

### Standard Transitions
```css
/* Fast */
.transition-fast {
  transition: all 150ms ease;
}

/* Standard */
.transition-standard {
  transition: all 200ms ease;
}

/* Slow */
.transition-slow {
  transition: all 300ms ease;
}

/* Color Only */
.transition-color {
  transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease;
}

/* Transform Only */
.transition-transform {
  transition: transform 300ms ease;
}
```

### Common Animations
```css
/* Fade In */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide In From Top */
@keyframes slide-in-top {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spin */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Neomorphic Design

ZplitGPT uses a sophisticated neomorphic design system with subtle shadows and highlights.

### Core Principles
```css
/* Light Source: Top-Left */
/* Dark Theme: Lighter shadows, darker highlights */

/* Neomorphic Shadows */
.neo-shadow {
  box-shadow: 
    /* Outer shadows */
    2px 2px 4px rgba(0, 0, 0, 0.3),
    -2px -2px 4px rgba(20, 20, 20, 0.3),
    /* Inner shadows */
    inset 2px 2px 4px rgba(5, 5, 5, 0.3),
    inset -2px -2px 4px rgba(15, 15, 15, 0.2);
}

/* Neomorphic Inset */
.neo-inset {
  box-shadow: 
    inset 2px 2px 4px rgba(5, 5, 5, 0.3),
    inset -2px -2px 4px rgba(15, 15, 15, 0.2);
}

/* Neomorphic Button */
.neo-button {
  background: var(--bg-secondary);
  box-shadow: 
    4px 4px 8px rgba(0, 0, 0, 0.3),
    -4px -4px 8px rgba(20, 20, 20, 0.3);
}

.neo-button:active {
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.3),
    inset -2px -2px 4px rgba(20, 20, 20, 0.3);
}
```

### Color Accents in Neomorphism
```css
/* Subtle color integration */
.neo-accent {
  box-shadow: 
    2px 4px 8px 0 rgba(255, 79, 43, 0.05),
    inset 0 0 12px 0 rgba(255, 79, 43, 0.02);
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
```

### Responsive Patterns
```css
/* Sidebar Responsiveness */
.sidebar {
  width: var(--sidebar-width);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 300ms ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* Model Columns */
.model-column {
  min-width: 320px;
}

@media (max-width: 1024px) {
  .model-column {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .model-column {
    min-width: 100%;
  }
}
```

---

## Dark Theme

### Theme Structure
ZplitGPT uses a comprehensive dark theme with multiple layers of darkness for visual hierarchy.

### Layer System
```css
/* Layer 0: Deepest (Main Background) */
.layer-0 { background-color: #000000; }

/* Layer 1: Component Backgrounds */
.layer-1 { background-color: #0a0a0a; }

/* Layer 2: Input/Panel Backgrounds */
.layer-2 { background-color: #111111; }

/* Layer 3: Hover/Active States */
.layer-3 { background-color: #1a1a1a; }

/* Layer 4: Borders/Dividers */
.layer-4 { background-color: #333333; }
```

### Text Hierarchy
```css
/* Primary Text (Highest Contrast) */
.text-primary { color: #f5f5f5; }

/* Secondary Text */
.text-secondary { color: #b3b3b3; }

/* Muted Text */
.text-muted { color: #666666; }
```

### Accessibility Considerations
```css
/* Focus Indicators */
.focus-indicator {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .text-secondary { color: #e0e0e0; }
  .border-primary { border-color: #666666; }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Utility Classes

### Common Tailwind Patterns
```css
/* Spacing */
.p-4 { padding: var(--space-4); }
.px-3 { padding-left: var(--space-3); padding-right: var(--space-3); }
.gap-2 { gap: var(--space-2); }

/* Colors */
.bg-black { background-color: var(--bg-primary); }
.bg-\[\#0a0a0a\] { background-color: var(--bg-secondary); }
.text-\[\#f5f5f5\] { color: var(--text-primary); }
.text-\[\#b3b3b3\] { color: var(--text-secondary); }

/* Borders */
.border-\[\#1a1a1a\] { border-color: var(--border-primary); }
.border-\[\#333333\] { border-color: var(--border-secondary); }

/* Transitions */
.transition-all { transition: all 200ms ease; }
.transition-colors { transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
```

---

## Component-Specific Guidelines

### Model Columns
```css
.model-column-header {
  background-color: var(--bg-tertiary);
  border-bottom: 2px solid;
  padding: var(--space-4);
}

.model-column-content {
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

.model-version-tab {
  padding: var(--space-1) var(--space-3);
  border-radius: 9999px;
  font-size: var(--text-xs);
  transition: all 200ms ease;
}

.model-version-tab.active {
  background-color: var(--brand-primary);
  color: white;
}
```

### Sidebar
```css
.sidebar-item {
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  transition: all 200ms ease;
  position: relative;
}

.sidebar-item:hover {
  background-color: var(--bg-quaternary);
}

.sidebar-item.active {
  background-color: var(--bg-quaternary);
  border-left: 3px solid var(--brand-primary);
}

.sidebar-item.active::after {
  content: '';
  position: absolute;
  right: var(--space-1);
  top: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(to left, var(--brand-primary), transparent);
  opacity: 0.5;
}
```

### Input Components
```css
.ai-input {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  transition: all 200ms ease;
}

.ai-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(255, 79, 43, 0.1);
}

.ai-input::placeholder {
  color: var(--text-placeholder);
}
```

---

## Best Practices

### 1. Color Usage
- Use brand color (`#ff4f2b`) sparingly for primary actions and accents
- Maintain contrast ratios for accessibility (WCAG AA minimum)
- Use opacity for subtle variations instead of new colors

### 2. Spacing
- Stick to the 4px base unit for consistency
- Use semantic spacing (component padding vs layout gaps)
- Maintain visual rhythm with consistent spacing

### 3. Typography
- Use monospace for code, inputs, and technical content
- Maintain clear hierarchy with size and weight variations
- Ensure line height provides good readability

### 4. Interactions
- All interactive elements should have hover states
- Focus states should be clearly visible
- Transitions should be fast (200ms) but not jarring

### 5. Neomorphic Design
- Maintain consistent light source (top-left)
- Use subtle shadows for depth
- Reserve strong shadows for important elements

### 6. Performance
- Use CSS transforms for animations (better performance)
- Minimize layout thrashing with batched updates
- Use will-change sparingly for animated elements

---

## Implementation Notes

### Tailwind Configuration
The project uses custom Tailwind configuration with:
- Custom color palette extensions
- Custom spacing scale
- Extended font families
- Animation utilities

### CSS Custom Properties
Extensive use of CSS custom properties for:
- Theme consistency
- Dynamic color switching
- Maintainable design tokens
- Runtime customization

### Component Architecture
- Consistent prop interfaces
- Reusable style patterns
- Composable design system
- Clear separation of concerns

---

This styling guide serves as the authoritative reference for ZplitGPT's visual design system. All components should adhere to these patterns to maintain consistency and quality across the application.