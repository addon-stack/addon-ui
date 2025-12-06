### ViewDrawer

The ViewDrawer component composes a View inside a Drawer. It combines the layout/header conveniences of View with slide‑in presentation from any screen edge via Drawer (Radix UI Dialog under the hood). Defaults can be provided via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {ViewDrawer, Button, DrawerSide} from "addon-ui";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open profile</Button>

            <ViewDrawer
                open={open}
                onOpenChange={setOpen}
                side={DrawerSide.Right}
                title="Profile"
                subtitle="Manage your personal info"
                before={<span>👤</span>}
                showSeparate
                center
            >
                <div style={{padding: 16}}>
                    <p>Drawer body content lives inside the View body.</p>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
            </ViewDrawer>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below. ViewDrawer accepts all View props and most Drawer props except Drawer’s `title` (use View’s `title` instead).

| Prop                | Type                                                                                                                                               | Default               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `side`              | `'left' \| 'right' \| 'top' \| 'bottom'`                                                                                                           | `'left'`              |
| `speed`             | `number`                                                                                                                                           | `200`                 |
| `fullscreen`        | `boolean` (applies to Drawer content)                                                                                                              | —                     |
| `open`              | `boolean`                                                                                                                                          | —                     |
| `defaultOpen`       | `boolean`                                                                                                                                          | —                     |
| `onOpenChange`      | `(open: boolean) => void`                                                                                                                          | —                     |
| `modal`             | `boolean`                                                                                                                                          | —                     |
| `container`         | `HTMLElement`                                                                                                                                      | —                     |
| `description`       | `string`                                                                                                                                           | —                     |
| View header props   | `title`, `subtitle`, `before`, `after`, `wrapClassName`, `titleClassName`, `beforeClassName`, `afterClassName`, `subtitleClassName`, `alignCenter` | [see View](./View.md) |
| View layout props   | `center`, `showSeparate`, `bodyClassName`, `headerClassName`, `children`                                                                           | —                     |
| `className`         | `string` (passed to Drawer content)                                                                                                                | —                     |
| `overlayClassName`  | `string` (Drawer overlay)                                                                                                                          | —                     |
| `childrenClassName` | `string` (Drawer child wrapper; inner View body has its own classes)                                                                               | —                     |

Notes:

- Drawer’s `title` prop is intentionally omitted in ViewDrawer. Use the View `title` prop instead.
- Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Enums

```ts
// Drawer sides
DrawerSide.Left;
DrawerSide.Right;
DrawerSide.Top;
DrawerSide.Bottom;
```

#### Radix UI props

ViewDrawer uses Drawer → Dialog under the hood (Radix UI Dialog). In addition to the props above, you can use common Radix Dialog props via Drawer:

- Root: `open`, `defaultOpen`, `onOpenChange`, `modal`
- Portal: `container`
- Content: standard event handlers like `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`

Full reference:
https://www.radix-ui.com/primitives/docs/components/dialog

### CSS variables

ViewDrawer doesn’t define its own stylesheet; it uses Drawer and View styles. Below are only the variables actually referenced by those stylesheets, with exact fallback chains.

#### CSS variables for Drawer (applied in ViewDrawer)

From `src/components/Drawer/drawer.module.scss`:

| Variable                    | Fallback chain                                                         |
| --------------------------- | ---------------------------------------------------------------------- |
| `--drawer-overlay-bg-color` | `var(--drawer-overlay-bg-color, var(--dialog-overlay-bg-color, #111))` |
| `--drawer-padding`          | `var(--drawer-padding, 0)`                                             |
| `--drawer-box-shadow`       | `var(--drawer-box-shadow, 0 0 4px rgba(0, 0, 0, 0.5))`                 |
| `--drawer-bg-color`         | `var(--drawer-bg-color, var(--bg-secondary-color))`                    |
| `--drawer-width`            | `var(--drawer-width, 90vw)`                                            |
| `--drawer-height`           | `var(--drawer-height, 90vh)`                                           |

Notes (Drawer): the animation duration comes from the Dialog `speed` prop (inline style). The overlay color falls back to Dialog’s overlay color.

#### CSS variables for View (applied in ViewDrawer)

From `src/components/View/view.module.scss`:

| Variable                          | Fallback chain                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `--view-header-padding-bottom`    | `var(--view-header-padding-bottom, var(--header-padding, var(--side-padding-sm)))` |
| `--view-header-title-color`       | `var(--view-header-title-color, var(--text-primary-color))`                        |
| `--view-header-title-font-family` | `var(--view-header-title-font-family, var(--font-family)), sans-serif`             |
| `--view-header-separate-width`    | `var(--view-header-separate-width, 1px)`                                           |
| `--view-header-separate-color`    | `var(--view-header-separate-color, var(--separator-color))`                        |
| `--view-speed-border-color`       | `var(--view-speed-border-color, var(--speed-color))`                               |

Notes (View): The header’s separate line animates its border color using the component-scoped speed variable `--view-speed-border-color` (fallbacks to the global `--speed-color`). Theme tokens like `--header-padding`, `--side-padding-sm`, `--text-primary-color`, `--font-family`, and `--separator-color` are fallbacks used by the component variables.

### Theming and global configuration

Provide defaults via theme/config for both the drawer behavior and the embedded view header:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {DrawerSide} from "addon-ui";

export default defineConfig({
    components: {
        viewDrawer: {
            side: DrawerSide.Right,
            speed: 200,
            fullscreen: false,
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
        viewDrawer: {
            side: "left",
            speed: 250,
            alignCenter: false,
            showSeparate: false,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Semantics and focus management are provided by Radix Dialog via Drawer. While open, focus is trapped and background content is inert (when `modal` is true).
- Provide meaningful `title` and optional `subtitle` via View props; they are rendered semantically in the header and assist screen reader users.
- Ensure close actions inside the drawer are keyboard accessible; Esc key behavior can be managed via Dialog props.
