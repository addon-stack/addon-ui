### Header

The Header component provides a page header with optional title, subtitle, and before/after slots. It supports centered alignment, theming via CSS variables, and default props via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {Header} from "addon-ui";

export function Example() {
    return (
        <>
            {/* Simple title */}
            <Header title="Dashboard" />

            {/* Title + subtitle with leading/trailing content */}
            <Header
                title={<>Analytics</>}
                before={<img src="/logo.svg" alt="Logo" width={20} height={20} />}
                after={<span style={{opacity: 0.7}}>beta</span>}
                subtitle="Insights and reports for your product"
            />

            {/* Left-aligned (disable center) and with actions as children */}
            <Header title="Projects" alignCenter={false}>
                <div style={{display: "flex", gap: 8}}>
                    <button>New</button>
                    <button>Filter</button>
                </div>
            </Header>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop                | Type                             | Default |
| ------------------- | -------------------------------- | ------- |
| `title`             | `ReactNode`                      | —       |
| `subtitle`          | `ReactNode`                      | —       |
| `before`            | `ReactNode`                      | —       |
| `after`             | `ReactNode`                      | —       |
| `wrapClassName`     | `string`                         | —       |
| `titleClassName`    | `string`                         | —       |
| `beforeClassName`   | `string`                         | —       |
| `afterClassName`    | `string`                         | —       |
| `subtitleClassName` | `string`                         | —       |
| `childrenClassName` | `string`                         | —       |
| `alignCenter`       | `boolean`                        | `true`  |
| HTML header attrs   | all standard `header` attributes | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

### CSS variables for Header

Only variables actually referenced in `src/components/Header/header.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                        | Fallback chain                                                       |
| ------------------------------- | -------------------------------------------------------------------- |
| `--header-gap`                  | `var(--header-gap, 10px)`                                            |
| `--header-padding`              | `var(--header-padding, var(--side-padding-sm))`                      |
| `--header-wrap-gap`             | `var(--header-wrap-gap, 10px)`                                       |
| `--header-title-gap`            | `var(--header-title-gap, 12px)`                                      |
| `--header-title-color`          | `var(--header-title-color, var(--text-primary-color))`               |
| `--header-title-font-size`      | `var(--header-title-font-size, 25px)`                                |
| `--header-title-font-family`    | `var(--header-title-font-family, var(--font-family)), sans-serif`    |
| `--header-title-font-weight`    | `var(--header-title-font-weight, 700)`                               |
| `--header-title-line-height`    | `var(--header-title-line-height, 120%)`                              |
| `--header-subtitle-color`       | `var(--header-subtitle-color, var(--text-secondary-color))`          |
| `--header-subtitle-font-size`   | `var(--header-subtitle-font-size, 14px)`                             |
| `--header-subtitle-font-family` | `var(--header-subtitle-font-family, var(--font-family)), sans-serif` |
| `--header-subtitle-font-weight` | `var(--header-subtitle-font-weight, 400)`                            |
| `--header-subtitle-line-height` | `var(--header-subtitle-line-height, 120%)`                           |
| `--header-speed-bg`             | `var(--header-speed-bg, var(--speed-color))`                         |
| `--header-speed-color`          | `var(--header-speed-color, var(--speed-color))`                      |

### Theming and global configuration

You can provide Header defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        header: {
            alignCenter: true,
            // You may also predefine before/after content
            // before: "My Brand",
            // after: "v1.0",
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        header: {
            alignCenter: false,
            // before: <img src="/logo.svg" alt="Logo" width={16} height={16} />,
            // after: <Badge>beta</Badge>,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Header renders a semantic `<header>` landmark; this helps screen reader users navigate.
- If your page has multiple headers, add an `aria-label` or `aria-labelledby` to distinguish them.
- Ensure interactive elements placed inside the header are keyboard accessible and meet contrast requirements.
