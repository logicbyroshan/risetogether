# RiseTogether Design System

The RiseTogether Design System establishes a cohesive, accessible visual language for the entire platform, balancing futuristic dark glassmorphism with high-contrast usability.

---

## 1. Brand Philosophy & Color Hierarchy

### The Orange Rule: `Brand + Action + Emphasis`
RiseTogether uses **Vibrant Orange** (`#f97316`) as its core brand signature. **Orange is an accent and action color, not a surface color.**
- **Do NOT** make every background, card, border, or text orange.
- **DO** use orange for primary call-to-actions (CTAs), active state indicators, key brand logos, and critical focal points.

### Color Tokens

```css
:root {
  /* Brand Tokens */
  --color-brand-primary: #f97316;       /* Orange-500: Primary CTAs & Brand */
  --color-brand-hover: #ea580c;         /* Orange-600: Hover interactions */
  --color-brand-active: #c2410c;        /* Orange-700: Active pressed state */
  --color-brand-soft: rgba(249, 115, 22, 0.12); /* Subtle pill & active tag backgrounds */
  --color-brand-glow: rgba(249, 115, 22, 0.35); /* Card focus & glow shadows */

  /* Neutral Surface Tokens */
  --color-bg-base: #111827;            /* Gray-900: Root canvas background */
  --color-bg-deep: #0b0f19;            /* Gray-950: Hero & modal backdrop */
  --color-surface: rgba(17, 24, 39, 0.85); /* Glassmorphic card surface */
  --color-surface-elevated: rgba(31, 41, 55, 0.7); /* Hovered / secondary card surface */
  --color-surface-hover: rgba(55, 65, 81, 0.5); /* List items & dropdown hover */

  /* Border Tokens */
  --color-border-brand: rgba(249, 115, 22, 0.25); /* Subtle brand border */
  --color-border-subtle: rgba(75, 85, 99, 0.4);   /* Neutral divider border */
  --color-border-focus: rgba(249, 115, 22, 0.8);  /* Form input focus border */

  /* Typography Tokens */
  --color-text-primary: #f9fafb;       /* Gray-50: Headings & main text */
  --color-text-secondary: #d1d5db;     /* Gray-300: Body copy & descriptions */
  --color-text-muted: #9ca3af;         /* Gray-400: Timestamps & metadata */
  --color-text-disabled: #6b7280;      /* Gray-500: Inactive controls */

  /* Semantic Feedback Tokens */
  --color-success: #10b981;            /* Emerald-500: Confirmations & active states */
  --color-warning: #f59e0b;            /* Amber-500: Cautions & alerts */
  --color-error: #f43f5e;              /* Rose-500: Form errors & deletions */
  --color-info: #3b82f6;               /* Blue-500: Informational notices */
}
```

---

## 2. Typography

| Role | Font Family | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **Display Heading** | `Rajdhani, sans-serif` | 36px–48px | 700 (Bold) | 1.15 | Hero headings, section titles |
| **Section Heading** | `Rajdhani, sans-serif` | 24px–30px | 700 (Bold) | 1.25 | Card headers, modal titles, page headers |
| **Subheading** | `Rajdhani, sans-serif` | 18px–20px | 600 (SemiBold) | 1.3 | Card titles, block headings |
| **Body (Default)** | `Inter, sans-serif` | 14px–16px | 400 (Regular) | 1.5 | Article text, post content, comments |
| **Body (Medium)** | `Inter, sans-serif` | 14px | 500 (Medium) | 1.4 | Form labels, navigation links |
| **Caption / Meta** | `Inter, sans-serif` | 12px | 400 (Regular) | 1.4 | Timestamps, badge labels, helper text |

---

## 3. Spacing Scale

The platform uses an 8-point harmonic spacing scale:
- `space-1` (4px): Micro gaps between icons and labels
- `space-2` (8px): Compact padding, button internal gaps
- `space-3` (12px): Badge padding, input vertical padding
- `space-4` (16px): Card internal padding, form row spacing
- `space-6` (24px): Modal padding, section separation
- `space-8` (32px): Layout grid gutter
- `space-12` (48px): Page section vertical rhythm

---

## 4. Surfaces, Glassmorphism & Radii

- **Radius Scale**:
  - `rounded-lg` (8px): Badges, tooltips, tags
  - `rounded-xl` (12px): Buttons, inputs, search bars, dropdown menus
  - `rounded-2xl` (16px): Content cards, post cards, modals
  - `rounded-full`: Avatars, circular icon buttons, status dots
- **Glassmorphism**:
  - `backdrop-filter: blur(12px)` with `background: rgba(17, 24, 39, 0.85)` and `border: 1px solid rgba(249, 115, 22, 0.22)`
  - Adds depth without visual clutter against dark backgrounds.

---

## 5. Accessibility & Interaction Standards

1. **Color Contrast**: All text rendered against dark backgrounds achieves a minimum contrast ratio of `4.5:1` (WCAG AA).
2. **Keyboard Navigation**: All interactive controls (`Button`, `Input`, `Dropdown`, `Modal`, `Tabs`) support standard `Tab`, `Enter`, `Space`, and `Escape` keys with visible focus rings (`focus:ring-2 focus:ring-orange-500/50`).
3. **Reduced Motion**: Animations utilize smooth ease transitions (`cubic-bezier(0.4, 0, 0.2, 1)`) with zero intrusive flashing.
