### Switch

The Switch component renders a toggle control built on top of Radix UI Switch. It supports theming via CSS variables and default props via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {Switch} from "addon-ui";

export function Example() {
    const [enabled, setEnabled] = React.useState(false);

    return (
        <div style={{display: "grid", gap: 16}}>
            {/* Uncontrolled */}
            <Switch />

            {/* Controlled */}
            <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable feature" />

            {/* With external label association */}
            <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <Switch id="notifications" />
                <label htmlFor="notifications">Enable notifications</label>
            </div>
        </div>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop               | Type                                                                                                                                                                     | Default |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `thumbClassName`   | `string`                                                                                                                                                                 | —       |
| Radix switch attrs | all `@radix-ui/react-switch` Root props (e.g., `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`, `id`, `asChild`, `aria-*`, etc.) | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Radix UI props

This component wraps Radix UI Switch. In addition to the props above, you can use Radix Root props. Common ones include:

- `checked`, `defaultChecked`
- `onCheckedChange`
- `disabled`, `required`
- `name`, `value`, `id`
- `asChild`
- `aria-*` accessibility attributes

Full reference:
https://www.radix-ui.com/primitives/docs/components/switch

### CSS variables for Switch

Only variables actually referenced in `src/components/Switch/switch.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                    | Fallback chain                                        |
| --------------------------- | ----------------------------------------------------- |
| `--switch-width`            | `var(--switch-width, 36px)`                           |
| `--switch-height`           | `var(--switch-height, 22px)`                          |
| `--switch-border-radius`    | `var(--switch-border-radius, 9999px)`                 |
| `--switch-bg-color`         | `var(--switch-bg-color, #bbb)`                        |
| `--switch-cheked-bg-color`  | `var(--switch-cheked-bg-color, var(--primary-color))` |
| `--primary-color`           | `var(--primary-color)` (none)                         |
| `--switch-disabled-opacity` | `var(--switch-disabled-opacity, 0.6)`                 |
| `--switch-thumb-width`      | `var(--switch-thumb-width, 18px)`                     |
| `--switch-thumb-height`     | `var(--switch-thumb-height, 18px)`                    |
| `--switch-thumb-bg-color`   | `var(--switch-thumb-bg-color, white)`                 |
| `--switch-speed-bg`         | `var(--switch-speed-bg, var(--speed-color))`          |
| `--switch-speed-transform`  | `var(--switch-speed-transform, var(--speed-sm))`      |

Notes:

- The thumb transform distance is calculated from the width/height variables; adjusting `--switch-width`, `--switch-height`, `--switch-thumb-width`, and `--switch-thumb-height` will keep the motion consistent.
- The variable name `--switch-cheked-bg-color` is intentionally spelled as in the stylesheet.
- Transitions use component-scoped `--switch-speed-*` variables with fallbacks to global `--speed-*` tokens.

### Theming and global configuration

You can provide Switch defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        switch: {
            // You can predefine common Radix props if desired
            // required: true,
            // disabled: false,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        switch: {
            // defaultChecked: true,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Switch renders an interactive control with appropriate `role="switch"` and `aria-checked` managed by Radix.
- Always provide an accessible name via `aria-label`, `aria-labelledby`, or a connected `<label htmlFor>`.
- Ensure sufficient contrast for track and thumb colors, including the checked and disabled states.
