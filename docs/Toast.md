### Toast

The Toast component displays brief notifications. It is built on top of Radix UI Toast (Provider/Root/Viewport) and supports Radix props in addition to library‑specific ones. Theming is supported via CSS variables, and defaults can be provided via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {Toast, Button, ToastSide, ToastRadius, ToastColor} from "addon-ui";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Trigger element (rendered inside the Radix Provider) */}
            <Toast
                open={open}
                onOpenChange={setOpen}
                title="Notification"
                description="Saved successfully"
                side={ToastSide.BottomRight}
                radius={ToastRadius.Medium}
                color={ToastColor.Success}
                duration={3000}
                onClose={() => setOpen(false)}
            >
                <Button onClick={() => setOpen(true)}>Show toast</Button>
            </Toast>

            {/* Full‑width sticky banner style (top center) */}
            <Toast
                open={false}
                onOpenChange={() => {}}
                title="Heads up"
                description="This is a full‑width notice"
                side={ToastSide.TopCenter}
                radius={ToastRadius.None}
                fullWidth
                sticky
            >
                <div />
            </Toast>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop                   | Type                                                                                                                                          | Default          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `side`                 | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-right' \| 'bottom-center' \| 'bottom-left'`                                             | `'bottom-right'` |
| `color`                | `'error' \| 'success'`                                                                                                                        | —                |
| `radius`               | `'none' \| 'small' \| 'medium' \| 'large'`                                                                                                    | —                |
| `title`                | `ReactNode`                                                                                                                                   | —                |
| `description`          | `ReactNode`                                                                                                                                   | —                |
| `action`               | `ReactNode`                                                                                                                                   | —                |
| `closeIcon`            | `ReactElement`                                                                                                                                | `'✖'`           |
| `closeProps`           | `IconButtonProps`                                                                                                                             | —                |
| `onClose`              | `() => void` (renders a close button when provided)                                                                                           | —                |
| `fullWidth`            | `boolean`                                                                                                                                     | —                |
| `sticky`               | `boolean`                                                                                                                                     | —                |
| `titleClassName`       | `string`                                                                                                                                      | —                |
| `descriptionClassName` | `string`                                                                                                                                      | —                |
| `actionClassName`      | `string`                                                                                                                                      | —                |
| `viewportClassName`    | `string`                                                                                                                                      | —                |
| Radix toast attrs      | All `@radix-ui/react-toast` Provider/Root props (e.g., `label`, `duration`, `swipeDirection`, `swipeThreshold`, `open`, `onOpenChange`, etc.) | —                |

Notes:

- Default `swipeDirection` is derived from `side`. Default `swipeThreshold` is `15px` for vertical swipes (`up`/`down`) and `50px` for horizontal swipes (`left`/`right`).
- When `onClose` is provided, an `IconButton` close control is rendered at the corner.

#### Enums

```ts
// Side
ToastSide.TopLeft;
ToastSide.TopCenter;
ToastSide.TopRight;
ToastSide.BottomRight;
ToastSide.BottomCenter;
ToastSide.BottomLeft;

// Radius
ToastRadius.None;
ToastRadius.Small;
ToastRadius.Medium;
ToastRadius.Large;

// Color
ToastColor.Error;
ToastColor.Success;
```

#### Radix UI props

This component uses Radix UI Toast under the hood (Provider, Root, Viewport). Commonly used props include:

- Provider: `duration`, `label`, `swipeDirection`, `swipeThreshold`
- Root: `open`, `onOpenChange`, `defaultOpen` (if used), and event handlers like `onEscapeKeyDown`

Full reference:
https://www.radix-ui.com/primitives/docs/components/toast

### CSS variables for Toast

Only variables actually referenced in `src/components/Toast/toast.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”. Variables starting with `--radix-toast-*` are provided by Radix UI at runtime.

| Variable                     | Fallback chain                                          |
| ---------------------------- | ------------------------------------------------------- |
| `--toast-gap`                | `var(--toast-gap, 15px)`                                |
| `--toast-bg-color`           | `var(--toast-bg-color, var(--bg-secondary-color))`      |
| `--toast-border-radius`      | `var(--toast-border-radius, 10px)`                      |
| `--toast-padding`            | `var(--toast-padding, var(--side-padding-xs))`          |
| `--toast-speed-animation`    | `var(--toast-speed-animation, var(--speed-md))`         |
| `--toast-speed-transform`    | `var(--toast-speed-transform, var(--speed-sm))`         |
| `--toast-speed-bg`           | `var(--toast-speed-bg, var(--speed-color))`             |
| `--toast-speed-color`        | `var(--toast-speed-color, var(--speed-color))`          |
| `--radix-toast-swipe-move-x` | `var(--radix-toast-swipe-move-x)` (provided by Radix)   |
| `--radix-toast-swipe-move-y` | `var(--radix-toast-swipe-move-y)` (provided by Radix)   |
| `--radix-toast-swipe-end-x`  | `var(--radix-toast-swipe-end-x)` (provided by Radix)    |
| `--radix-toast-swipe-end-y`  | `var(--radix-toast-swipe-end-y)` (provided by Radix)    |
| `--toast-error-bg-color`     | `var(--toast-error-bg-color, var(--error-color))`       |
| `--toast-success-bg-color`   | `var(--toast-success-bg-color, var(--success-color))`   |
| `--toast-error-text-color`   | `var(--toast-error-text-color, white)`                  |
| `--toast-success-text-color` | `var(--toast-success-text-color, white)`                |
| `--toast-close-offset`       | `var(--toast-close-offset, 5px)`                        |
| `--toast-viewport-gap`       | `var(--toast-viewport-gap, 10px)`                       |
| `--toast-width`              | `var(--toast-width, 300px)`                             |
| `--toast-viewport-padding`   | `var(--toast-viewport-padding, var(--side-padding-xs))` |

Notes:

- Radius modifiers reuse the same `--toast-border-radius` variable with contextual defaults: `6px` (small), `15px` (medium), `20px` (large). Define `--toast-border-radius` to affect all radius presets at once.
- Viewport automatically switches to `width: 100%` when a toast has the `--full-width` modifier, and removes internal padding when `--sticky` is applied.

### Theming and global configuration

Provide Toast defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {ToastSide, ToastRadius, ToastColor} from "addon-ui";

export default defineConfig({
    components: {
        toast: {
            side: ToastSide.BottomRight,
            radius: ToastRadius.Medium,
            color: ToastColor.Success,
            duration: 4000,
            // Provider options
            swipeDirection: "right",
            swipeThreshold: 50,
            // Close control defaults
            closeIcon: "✖",
            // closeProps: { size: IconButtonSize.Medium },
            // Layout
            fullWidth: false,
            sticky: false,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        toast: {
            side: "top-center",
            duration: 3000,
            fullWidth: true,
            sticky: true,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Radix Toast manages focus and announces changes using ARIA live region semantics. Use the Provider `label` to describe the toasts collection for assistive tech.
- Provide meaningful `title` and, where helpful, `description` for context.
- Ensure the close button (when `onClose` is provided) has an accessible name (`aria-label="Close"` is applied by default on the internal IconButton).
- Avoid conveying critical information by color alone; pair with text.
