### ViewModal

The ViewModal component composes a View inside a centered Modal. It combines the layout/header conveniences of View with Modal’s overlayed presentation (using Dialog/Radix UI under the hood). Defaults can be provided via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {ViewModal, Button, ModalRadius, ModalAnimation} from "addon-ui";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open profile</Button>

            <ViewModal
                open={open}
                onOpenChange={setOpen}
                title="Profile"
                subtitle="Manage your personal info"
                before={<span>👤</span>}
                radius={ModalRadius.Medium}
                animation={ModalAnimation.FadeScale}
            >
                <div style={{padding: 16, minWidth: 320}}>
                    <p>Modal body content lives inside the View body.</p>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            </ViewModal>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below. ViewModal accepts all View props and most Modal props except Modal’s `title` (use View’s `title` instead).

| Prop                | Type                                                                                                                                               | Default               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `speed`             | `number`                                                                                                                                           | `200`                 |
| `fullscreen`        | `boolean` (applies to Modal content)                                                                                                               | `true`                |
| `radius`            | `'none' \| 'small' \| 'medium' \| 'large'`                                                                                                         | —                     |
| `animation`         | `'fade' \| 'fadeScale'`                                                                                                                            | `'fadeScale'`         |
| `closeButton`       | `boolean \| IconButtonProps \| ReactElement`                                                                                                       | `true`                |
| `onClose`           | `() => void`                                                                                                                                       | —                     |
| `open`              | `boolean`                                                                                                                                          | —                     |
| `defaultOpen`       | `boolean`                                                                                                                                          | —                     |
| `onOpenChange`      | `(open: boolean) => void`                                                                                                                          | —                     |
| `modal`             | `boolean`                                                                                                                                          | —                     |
| `container`         | `Element \| DocumentFragment \| null`                                                                                                              | —                     |
| `description`       | `string`                                                                                                                                           | —                     |
| View header props   | `title`, `subtitle`, `before`, `after`, `wrapClassName`, `titleClassName`, `beforeClassName`, `afterClassName`, `subtitleClassName`, `alignCenter` | [see View](./View.md) |
| View layout props   | `center`, `showSeparate`, `bodyClassName`, `headerClassName`, `children`                                                                           | —                     |
| `className`         | `string` (passed to Modal content)                                                                                                                 | —                     |
| `overlayClassName`  | `string` (Modal overlay)                                                                                                                           | —                     |
| `childrenClassName` | `string` (Modal child wrapper; inner View body has its own classes)                                                                                | —                     |

Notes:

- Modal’s standalone `title` prop is intentionally omitted in ViewModal. Use the View `title` prop instead.
- Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

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

ViewModal uses Modal → Dialog under the hood (Radix UI Dialog). In addition to the props above, you can use common Radix Dialog props via Modal:

- Root: `open`, `defaultOpen`, `onOpenChange`, `modal`
- Portal: `container`
- Content: standard event handlers like `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`

Full reference:
https://www.radix-ui.com/primitives/docs/components/dialog

### CSS variables

ViewModal doesn’t define its own stylesheet; it uses Modal and View styles. Below are only the variables actually referenced by those stylesheets, with exact fallback chains.

#### CSS variables for Modal (applied in ViewModal)

From `src/components/Modal/modal.module.scss`:

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

Notes (Modal):

- The `fullscreen` modifier forces 100% width/height and resets border-radius by class, not by variable.
- The overlay color falls back to Dialog’s overlay.
- Animation choice is prop-driven; duration comes from Dialog’s `speed` prop (inline style).

#### CSS variables for View (applied in ViewModal)

From `src/components/View/view.module.scss`:

| Variable                          | Fallback chain                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `--view-header-padding-bottom`    | `var(--view-header-padding-bottom, var(--header-padding, var(--side-padding-sm)))` |
| `--view-header-title-color`       | `var(--view-header-title-color, var(--text-primary-color))`                        |
| `--view-header-title-font-family` | `var(--view-header-title-font-family, var(--font-family)), sans-serif`             |
| `--view-header-separate-width`    | `var(--view-header-separate-width, 1px)`                                           |
| `--view-header-separate-color`    | `var(--view-header-separate-color, var(--separator-color))`                        |

### Theming and global configuration

Provide defaults via theme/config for both the modal behavior and the embedded view header:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {ModalRadius, ModalAnimation} from "addon-ui";

export default defineConfig({
    components: {
        viewModal: {
            radius: ModalRadius.Medium,
            animation: ModalAnimation.FadeScale,
            fullscreen: true,
            // View defaults
            alignCenter: true,
            showSeparate: true,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        viewModal: {
            radius: "small",
            animation: "fade",
            fullscreen: false,
            alignCenter: false,
            showSeparate: false,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Semantics and focus management are provided by Radix Dialog via Modal. While open, focus is trapped and background content is inert (when `modal` is true).
- Provide meaningful `title` and optional `subtitle` via View props; they are rendered semantically in the header and assist screen reader users.
- Ensure close actions inside the modal are keyboard accessible; Esc key behavior can be managed via Dialog props.

#### Portal container

`container?: Element | DocumentFragment | null` resolves from the explicit prop, then component configuration (`ui.config.ts` merged with `UIProvider.components`), then `UIProvider.portal`, and finally `document.body`. `undefined` skips a level; `null` waits without rendering a portal. See [Shadow DOM](./ShadowDOM.md) for CSS delivery, host attributes and examples.
