### Tooltip

A wrapper around `@radix-ui/react-tooltip` that provides a convenient API and themeable styles. It renders a trigger (your child element) and a floating content panel with an optional arrow.

See Radix docs for base behavior and keyboard interaction: https://www.radix-ui.com/primitives/docs/components/tooltip

#### Import and basic usage

```tsx
import {Tooltip} from "addon-ui";

export function Example() {
    return (
        <Tooltip content="Copy" side="top" align="center">
            <button aria-label="Copy">📋</button>
        </Tooltip>
    );
}
```

---

#### Props

Only the prop name, type, and default are listed below.

| Prop                      | Type                                                                         | Default |
| ------------------------- | ---------------------------------------------------------------------------- | ------- |
| `content`                 | `ReactNode`                                                                  | —       |
| `delayDuration`           | `number`                                                                     | `250`   |
| `collisionPadding`        | `number \| { top?: number; right?: number; bottom?: number; left?: number }` | `8`     |
| `matchTriggerWidth`       | `boolean`                                                                    | —       |
| `arrowWidth`              | `number`                                                                     | —       |
| `arrowHeight`             | `number`                                                                     | —       |
| `contentClassName`        | `string`                                                                     | —       |
| `arrowClassName`          | `string`                                                                     | —       |
| `children`                | `ReactNode`                                                                  | —       |
| `open`                    | `boolean`                                                                    | —       |
| `defaultOpen`             | `boolean`                                                                    | —       |
| `onOpenChange`            | `(open: boolean) => void`                                                    | —       |
| `disableHoverableContent` | `boolean`                                                                    | —       |
| `side`                    | `'top' \| 'right' \| 'bottom' \| 'left'`                                     | —       |
| `align`                   | `'start' \| 'center' \| 'end'`                                               | —       |
| `sideOffset`              | `number`                                                                     | —       |
| `alignOffset`             | `number`                                                                     | —       |
| `avoidCollisions`         | `boolean`                                                                    | —       |
| `sticky`                  | `'partial' \| 'always' \| boolean`                                           | —       |
| Radix Root props          | all `TooltipProps` (Root)                                                    | —       |
| Radix Content props       | all `TooltipContentProps` (Content)                                          | —       |

Note: You don’t need to wrap your app with Radix Tooltip Provider — the component already includes a Provider internally.

---

### CSS variables for Tooltip

Only variables actually referenced in `src/components/Tooltip/tooltip.module.scss` are listed, with their exact fallback chains.

| Variable                            | Fallback chain                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `--tooltip-font-family`             | `var(--tooltip-font-family, var(--font-family))`                                  |
| `--tooltip-font-weight`             | `var(--tooltip-font-weight, 500)`                                                 |
| `--tooltip-font-size`               | `var(--tooltip-font-size, var(--font-size, 14px))`                                |
| `--tooltip-line-height`             | `var(--tooltip-line-height, var(--line-height, 1rem))`                            |
| `--tooltip-color`                   | `var(--tooltip-color, var(--text-secondary-color))`                               |
| `--tooltip-bg-color`                | `var(--tooltip-bg-color, var(--bg-secondary-color))`                              |
| `--tooltip-border-radius`           | `var(--tooltip-border-radius, 5px)`                                               |
| `--tooltip-border-width`            | `var(--tooltip-border-width, 1px)`                                                |
| `--tooltip-border-color`            | `var(--tooltip-border-color, var(--tooltip-bg-color, var(--bg-secondary-color)))` |
| `--tooltip-padding`                 | `var(--tooltip-padding, 7px 10px)`                                                |
| `--tooltip-max-width`               | `var(--tooltip-max-width, 300px)`                                                 |
| `--tooltip-box-shadow-offset`       | `var(--tooltip-box-shadow-offset, 0 0 5px 0)`                                     |
| `--tooltip-box-shadow-color`        | `var(--tooltip-box-shadow-color, rgba(210, 208, 208, 0.47))`                      |
| `--tooltip-slide-distance`          | `var(--tooltip-slide-distance, 2px)`                                              |
| `--tooltip-arrow-box-shadow-offset` | `var(--tooltip-arrow-box-shadow-offset, 0 1px 4px 2px)`                           |
| `--tooltip-speed-animation`         | `var(--tooltip-speed-animation, var(--speed-md))`                                 |
| `--tooltip-speed-border-color`      | `var(--tooltip-speed-border-color, var(--speed-color))`                           |
| `--tooltip-speed-box-shadow`        | `var(--tooltip-speed-box-shadow, var(--speed-color))`                             |
| `--tooltip-speed-color`             | `var(--tooltip-speed-color, var(--speed-color))`                                  |
| `--tooltip-speed-bg`                | `var(--tooltip-speed-bg, var(--speed-color))`                                     |
| `--tooltip-speed-fill`              | `var(--tooltip-speed-fill, var(--speed-color))`                                   |
| `--tooltip-speed-stroke`            | `var(--tooltip-speed-stroke, var(--speed-color))`                                 |

Notes:

- Animation duration uses the component-scoped `--tooltip-speed-animation` with fallback to the global `--speed-md`.
- When `matchTriggerWidth` is enabled, the modifier uses `var(--radix-tooltip-trigger-width)` to match the trigger width.

---

### Accessibility (A11y)

- Built on Radix Tooltip, inheriting ARIA roles and keyboard interactions.
- Tooltips should supplement, not replace, essential information. Don’t hide critical instructions only in a tooltip.
- Ensure trigger elements are focusable (e.g., buttons, links) for keyboard users.

Radix accessibility guide: https://www.radix-ui.com/primitives/docs/components/tooltip

---

### Usage notes

- Use `side`, `align`, and offsets to control placement; `avoidCollisions` helps keep the tooltip visible.
- Arrow size is visual; adjust `sideOffset` if the arrow overlaps the trigger.
