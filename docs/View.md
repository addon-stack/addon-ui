### View

The View component provides a page section composed of a Header (title, subtitle, before/after) and a flexible body area. It supports centered layout, an optional header separator, theming via CSS variables, and default props via UIProvider/ui.config.ts.

#### Import and basic usage

```tsx
import React from "react";
import {View} from "addon-ui";

export function Example() {
    return (
        <div style={{background: "var(--bg-secondary-color)", padding: 16, borderRadius: 10}}>
            <View
                title="Page title"
                subtitle="Optional subtitle"
                before={
                    <span role="img" aria-label="logo">
                        ⚙️
                    </span>
                }
                after={<span style={{opacity: 0.7}}>beta</span>}
                alignCenter
                center
                showSeparate
            >
                <div style={{padding: 16}}>Main content goes here</div>
            </View>
        </div>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop              | Type                                                                                                                                                                                                    | Default |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `center`          | `boolean`                                                                                                                                                                                               | —       |
| `showSeparate`    | `boolean`                                                                                                                                                                                               | —       |
| `bodyClassName`   | `string`                                                                                                                                                                                                | —       |
| `headerClassName` | `string`                                                                                                                                                                                                | —       |
| Header props      | All props from `Header` (e.g., `title`, `subtitle`, `before`, `after`, `wrapClassName`, `titleClassName`, `beforeClassName`, `afterClassName`, `subtitleClassName`, `childrenClassName`, `alignCenter`) | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

### CSS variables for View

Only variables actually referenced in `src/components/View/view.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                          | Fallback chain                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `--view-header-padding-bottom`    | `var(--view-header-padding-bottom, var(--header-padding, var(--side-padding-sm)))` |
| `--view-header-title-color`       | `var(--view-header-title-color, var(--text-primary-color))`                        |
| `--view-header-title-font-family` | `var(--view-header-title-font-family, var(--font-family)), sans-serif`             |
| `--view-header-separate-width`    | `var(--view-header-separate-width, 1px)`                                           |
| `--view-header-separate-color`    | `var(--view-header-separate-color, var(--separator-color))`                        |
| `--view-speed-border-color`       | `var(--view-speed-border-color, var(--speed-color))`                               |

### Theming and global configuration

You can provide View defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        view: {
            // Common header defaults
            alignCenter: true,
            // Component flags
            center: true,
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
        view: {
            alignCenter: false,
            center: false,
            showSeparate: false,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- View renders a structural wrapper (`<div>`) with an internal semantic Header. Provide meaningful `title`/`subtitle` for screen readers via Header props.
- If the page contains multiple headers/sections, ensure headings follow a logical order and consider `aria-label`/`aria-labelledby` on surrounding regions when appropriate.
- When `center` is used, ensure focusable content remains reachable and visible within the centered layout.
