### Dialog

The Dialog component displays modal content in a layer above the page. It is built on top of Radix UI Dialog and supports Radix Root/Portal/Content props in addition to library-specific props. Theming is supported via CSS variables.

#### Import and basic usage

```tsx
import React from "react";
import {Dialog, Button} from "addon-ui";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open dialog</Button>

            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Confirmation"
                description="Please confirm your action"
                speed={200}
            >
                <div style={{padding: 16, minWidth: 320}}>
                    <h2 style={{marginTop: 0}}>Are you sure?</h2>
                    <p>This action cannot be undone.</p>
                    <div style={{display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end"}}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                /* your confirm logic */ setOpen(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop                | Type                                                   | Default |
| ------------------- | ------------------------------------------------------ | ------- |
| `speed`             | `number`                                               | `200`   |
| `description`       | `string`                                               | —       |
| `fullscreen`        | `boolean`                                              | —       |
| `className`         | `string`                                               | —       |
| `overlayClassName`  | `string`                                               | —       |
| `childrenClassName` | `string`                                               | —       |
| `open`              | `boolean`                                              | —       |
| `defaultOpen`       | `boolean`                                              | —       |
| `onOpenChange`      | `(open: boolean) => void`                              | —       |
| `modal`             | `boolean`                                              | —       |
| `container`         | `HTMLElement`                                          | —       |
| `title`             | `string`                                               | —       |
| Radix dialog attrs  | All `@radix-ui/react-dialog` Root/Portal/Content props | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Radix UI props

This component wraps Radix UI Dialog. In addition to the props above, you can use Radix props. Commonly used ones include:

- Root: `open`, `defaultOpen`, `onOpenChange`, `modal`
- Portal: `container`
- Content: `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`

For the complete list, see Radix UI Dialog documentation:
https://www.radix-ui.com/primitives/docs/components/dialog

### CSS variables for Dialog

Only variables actually referenced in `src/components/Dialog/dialog.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                             | Fallback chain                                   |
| ------------------------------------ | ------------------------------------------------ |
| `--dialog-overlay-bg-color`          | `var(--dialog-overlay-bg-color, #111)`           |
| `--dialog-animation-overlay-opacity` | `var(--dialog-animation-overlay-opacity, 0.9)`   |
| `--dialog-speed-bg`                  | `var(--dialog-speed-bg, var(--speed-color))`     |
| `--dialog-speed-transform`           | `var(--dialog-speed-transform, var(--speed-sm))` |
| `--dialog-speed-opacity`             | `var(--dialog-speed-opacity, var(--speed-sm))`   |
| `--dialog-speed-color`               | `var(--dialog-speed-color, var(--speed-color))`  |

Notes:

- `speed` prop controls inline `animation-duration` on overlay and content; it is not a CSS variable.
- Content transitions use component-scoped `--dialog-speed-*` variables with fallbacks to global `--speed-*` tokens.

### Theming and global configuration

You can provide Dialog defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        dialog: {
            // library-specific defaults
            speed: 200,
            // You can also set Radix props if you commonly use them
            modal: true,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        dialog: {
            speed: 250,
            modal: true,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Title and Description are rendered inside a visually hidden container for screen readers. Provide meaningful `title` and `description`.
- When `modal` is true, background content is inert and focus is trapped by Radix.
- Ensure actions inside the dialog are reachable by keyboard and that initial focus is set appropriately (Radix manages this by default).
