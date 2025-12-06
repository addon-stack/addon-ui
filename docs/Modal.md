### Modal

The Modal component displays content centered above the page using the library Dialog under the hood (Radix UI Dialog). It adds modal‑specific features like radius presets, animations, fullscreen mode, and a built‑in close button. Theming is supported via CSS variables, and defaults can be provided via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {Modal, Button, ModalRadius, ModalAnimation} from "addon-ui";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open modal</Button>

            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Modal title"
                description="Optional description for screen readers"
                radius={ModalRadius.Medium}
                animation={ModalAnimation.FadeScale}
                // fullscreen is true by default for Modal
            >
                <div style={{padding: 16, minWidth: 320}}>
                    <h2 style={{marginTop: 0}}>Hello</h2>
                    <p>Modal content goes here.</p>
                    <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below. Modal also supports all Dialog props (see the Dialog doc and Radix section below).

| Prop          | Type                                                                                                                                                                               | Default       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `radius`      | `'none' \| 'small' \| 'medium' \| 'large'`                                                                                                                                         | —             |
| `closeButton` | `boolean \| IconButtonProps \| ReactElement`                                                                                                                                       | `true`        |
| `onClose`     | `() => void`                                                                                                                                                                       | —             |
| `animation`   | `'fade' \| 'fadeScale'`                                                                                                                                                            | `'fadeScale'` |
| `fullscreen`  | `boolean`                                                                                                                                                                          | `true`        |
| Dialog props  | All props from `Dialog` (`speed`, `open`, `defaultOpen`, `onOpenChange`, `modal`, `container`, `title`, `description`, `className`, `overlayClassName`, `childrenClassName`, etc.) | —             |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Enums

```ts
// Radius
ModalRadius.None;
ModalRadius.Small;
ModalRadius.Medium;
ModalRadius.Large;

// Animation
ModalAnimation.Fade;
ModalAnimation.FadeScale;
```

#### Radix UI props

Modal uses the library Dialog component which wraps Radix UI Dialog. In addition to the Modal props above, you can use common Radix Dialog props via Dialog:

- Root: `open`, `defaultOpen`, `onOpenChange`, `modal`
- Portal: `container`
- Content: `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`

Full reference:
https://www.radix-ui.com/primitives/docs/components/dialog

### CSS variables for Modal

Only variables actually referenced in `src/components/Modal/modal.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                          | Fallback chain                                                        |
| --------------------------------- | --------------------------------------------------------------------- |
| `--modal-overlay-bg-color`        | `var(--modal-overlay-bg-color, var(--dialog-overlay-bg-color, #111))` |
| `--modal-width`                   | `var(--modal-width, 90vw)`                                            |
| `--modal-max-width`               | `var(--modal-max-width, 350px)`                                       |
| `--modal-max-height`              | `var(--modal-max-height, 85vh)`                                       |
| `--modal-padding`                 | `var(--modal-padding, 0)`                                             |
| `--modal-border-radius`           | `var(--modal-border-radius, 10px)`                                    |
| `--modal-box-shadow`              | `var(--modal-box-shadow, 0 0 4px rgba(0, 0, 0, 0.5))`                 |
| `--modal-bg-color`                | `var(--modal-bg-color, var(--bg-primary-color))`                      |
| `--modal-border-radius-sm`        | Contextual defaults: `5px` (small), `15px` (medium), `20px` (large)   |
| `--modal-close-offset`            | `var(--modal-close-offset, 5px)`                                      |
| `--modal-animation-content-scale` | `var(--modal-animation-content-scale, 0.96)`                          |
| `--modal-speed-bg`                | `var(--modal-speed-bg, var(--speed-color))`                           |
| `--modal-speed-transform`         | `var(--modal-speed-transform, var(--speed-sm))`                       |
| `--modal-speed-opacity`           | `var(--modal-speed-opacity, var(--speed-sm))`                         |
| `--modal-speed-color`             | `var(--modal-speed-color, var(--speed-color))`                        |

Notes:

- The `fullscreen` modifier forces `width/height: 100%` and `border-radius: 0` via a class, not a variable.
- The `animation` prop selects between `fade` and `fadeScale` keyframes; actual duration comes from Dialog (inline style using the `speed` prop).
- `--modal-border-radius-sm` is reused for all radius modifiers with different contextual defaults. Define it to override all three at once.

### Theming and global configuration

You can provide Modal defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {ModalRadius, ModalAnimation} from "addon-ui";

export default defineConfig({
    components: {
        modal: {
            radius: ModalRadius.Medium,
            animation: ModalAnimation.FadeScale,
            fullscreen: true,
            // You may also set common Dialog defaults here, e.g.:
            // speed: 200,
            // modal: true,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        modal: {
            radius: "small",
            animation: "fade",
            fullscreen: false,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Provide meaningful `title` and optional `description` for assistive technologies (Modal renders them via Dialog in a visually hidden region).
- Focus is managed and background content is inert when `modal` is true (handled by Radix UI Dialog).
- Ensure close controls are keyboard accessible; Esc key handling can be controlled via Radix content props.
