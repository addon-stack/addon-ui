### Drawer

The Drawer component displays a sliding panel from any screen edge. It builds on the Dialog component (Radix UI Dialog under the hood) and adds a side placement option. Supports theming via CSS variables and default props via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {Button, Drawer, DrawerSide} from "addon-ui";

export function Example() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <div style={{display: "flex", gap: 12, flexWrap: "wrap"}}>
                <Button onClick={() => setOpen(true)}>Open left drawer</Button>
                <Button onClick={() => setOpen(true)}>Open again</Button>
            </div>

            <Drawer open={open} onOpenChange={setOpen} side={DrawerSide.Left}>
                <div style={{padding: 16}}>
                    <h2 style={{margin: 0}}>Left drawer</h2>
                    <p>Any content goes here.</p>
                    <div style={{display: "flex", gap: 8}}>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </div>
                </div>
            </Drawer>

            {/* Other sides */}
            <Drawer open={false} onOpenChange={() => {}} side={DrawerSide.Right}>
                <div />
            </Drawer>
            <Drawer open={false} onOpenChange={() => {}} side={DrawerSide.Top}>
                <div />
            </Drawer>
            <Drawer open={false} onOpenChange={() => {}} side={DrawerSide.Bottom}>
                <div />
            </Drawer>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below. Drawer supports all Dialog props as well (see Dialog doc and Radix section below).

| Prop         | Type                                                                                                                                                                                | Default  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `container`  | `Element \| DocumentFragment \| null`                                                                                                                                               | —        |
| `side`       | `'left' \| 'right' \| 'top' \| 'bottom'`                                                                                                                                            | `'left'` |
| Dialog props | All props from `Dialog` (`speed`, `fullscreen`, `open`, `defaultOpen`, `onOpenChange`, `modal`, `container`, `title`, `description`, `overlayClassName`, `childrenClassName`, etc.) | —        |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Sides (enum)

```ts
DrawerSide.Left;
DrawerSide.Right;
DrawerSide.Top;
DrawerSide.Bottom;
```

#### Radix UI props

Drawer uses Radix UI Dialog under the hood via the library's Dialog component. You can therefore use common Radix Dialog props in addition to Drawer props.

Common Radix Dialog props:

- `open`, `defaultOpen`, `onOpenChange`
- `modal`
- `container`
- Accessibility-related attributes are handled internally via Radix (Title/Description)

Full reference:
https://www.radix-ui.com/primitives/docs/components/dialog

### CSS variables for Drawer

Only variables actually referenced in `src/components/Drawer/drawer.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                    | Fallback chain                                                         |
| --------------------------- | ---------------------------------------------------------------------- |
| `--drawer-overlay-bg-color` | `var(--drawer-overlay-bg-color, var(--dialog-overlay-bg-color, #111))` |
| `--drawer-padding`          | `var(--drawer-padding, 0)`                                             |
| `--drawer-box-shadow`       | `var(--drawer-box-shadow, 0 0 4px rgba(0, 0, 0, 0.5))`                 |
| `--drawer-bg-color`         | `var(--drawer-bg-color, var(--bg-secondary-color))`                    |
| `--drawer-width`            | `var(--drawer-width, 90vw)`                                            |
| `--drawer-height`           | `var(--drawer-height, 90vh)`                                           |

Notes:

- The overlay inherits position/sizing/animation from the Dialog component; only its background color is themed here with a fallback to `--dialog-overlay-bg-color`.
- The actual animation duration is controlled by the `speed` prop (coming from Dialog) and applied inline.

### Theming and global configuration

Provide Drawer defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {DrawerSide} from "addon-ui";

export default defineConfig({
    components: {
        drawer: {
            side: DrawerSide.Left,
            // Inherit Dialog defaults too, e.g. speed/fullscreen
            speed: 200,
            fullscreen: false,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        drawer: {
            side: "right",
            speed: 250,
            fullscreen: false,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Drawer content is presented using Radix Dialog semantics: focus is trapped while open, background content is inert.
- Provide meaningful `title` and optional `description` (used by the underlying Dialog for screen readers).
- Ensure that closing controls are keyboard accessible and that Esc key behavior (if enabled via Radix) aligns with your UX.

#### Portal container

`container?: Element | DocumentFragment | null` resolves from the explicit prop, then component configuration (`ui.config.ts` merged with `UIProvider.components`), then `UIProvider.portal`, and finally `document.body`. `undefined` skips a level; `null` waits without rendering a portal. See [Shadow DOM](./ShadowDOM.md) for CSS delivery, host attributes and examples.
