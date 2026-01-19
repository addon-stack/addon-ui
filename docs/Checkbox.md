### Checkbox

The Checkbox component provides a customizable checkbox with style variants, sizes, and corner radii. It supports theming via CSS variables and default props via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {Checkbox, CheckboxVariant, CheckboxSize, CheckboxRadius} from "addon-ui";

export function Example() {
    const [checked, setChecked] = React.useState(false as boolean | "indeterminate");

    return (
        <div style={{display: "flex", gap: 12, alignItems: "center"}}>
            {/* Uncontrolled */}
            <Checkbox />

            {/* Controlled */}
            <Checkbox checked={checked} onCheckedChange={setChecked} />

            {/* Variants */}
            <Checkbox variant={CheckboxVariant.Classic} checked />
            <Checkbox variant={CheckboxVariant.Soft} />

            {/* Sizes */}
            <Checkbox size={CheckboxSize.Small} />
            <Checkbox size={CheckboxSize.Medium} />
            <Checkbox size={CheckboxSize.Large} />

            {/* Radius */}
            <Checkbox radius={CheckboxRadius.Small} />
            <Checkbox radius={CheckboxRadius.Large} />

            {/* Indeterminate with custom icons */}
            <Checkbox checked={"indeterminate"} checkedIcon={<span>✔</span>} indeterminateIcon={<span>―</span>} />

            {/* Disabled */}
            <Checkbox disabled />
        </div>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop                 | Type                                                                                                                                    | Default |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `indicatorClassName` | `string`                                                                                                                                | —       |
| `size`               | `'small' \| 'medium' \| 'large'`                                                                                                        | —       |
| `radius`             | `'small' \| 'large'`                                                                                                                    | —       |
| `variant`            | `'classic' \| 'soft'`                                                                                                                   | —       |
| `checkedIcon`        | `ReactElement`                                                                                                                          | `"✔"`   |
| `indeterminateIcon`  | `ReactElement`                                                                                                                          | `"―"`   |
| Radix checkbox attrs | all `@radix-ui/react-checkbox` Root props (e.g., `checked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`, `aria-*`, etc.) | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Radix UI props

Built on Radix UI Checkbox. In addition to the props above, you can use Radix Root props. Common ones include:

- `checked` (supports `boolean` or `'indeterminate'` via `CheckedState`)
- `defaultChecked`
- `onCheckedChange`
- `disabled`, `required`
- `name`, `value`, `id`
- `aria-*` accessibility attributes

For the complete list, see Radix UI Checkbox documentation:
https://www.radix-ui.com/primitives/docs/components/checkbox

#### Variants, sizes, radii (enums)

```ts
// Variants
CheckboxVariant.Classic;
CheckboxVariant.Soft;

// Sizes
CheckboxSize.Small;
CheckboxSize.Medium;
CheckboxSize.Large;

// Radius
CheckboxRadius.Small;
CheckboxRadius.Large;
```

### CSS variables for Checkbox

Only variables actually referenced in `src/components/Checkbox/checkbox.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                          | Fallback chain                                           |
| --------------------------------- | -------------------------------------------------------- |
| `--checkbox-size`                 | `var(--checkbox-size, 18px)`                             |
| `--checkbox-border-radius`        | `var(--checkbox-border-radius, 4px)`                     |
| `--checkbox-color`                | `var(--checkbox-color, #333)`                            |
| `--checkbox-border-width`         | `var(--checkbox-border-width, 1px)`                      |
| `--checkbox-border-color`         | `var(--checkbox-border-color, #999)`                     |
| `--checkbox-disabled-opacity`     | `var(--checkbox-disabled-opacity, 0.6)`                  |
| `--checkbox-scale`                | `var(--checkbox-scale, 0.98)`                            |
| `--checkbox-classic-color`        | `var(--checkbox-classic-color, white)`                   |
| `--checkbox-classic-bg-color`     | `var(--checkbox-classic-bg-color)` (none)                |
| `--checkbox-classic-border-width` | `var(--checkbox-classic-border-width, 1px)`              |
| `--checkbox-classic-border-color` | `var(--checkbox-classic-border-color, #999)`             |
| `--checkbox-checked-bg-color`     | `var(--checkbox-checked-bg-color, var(--primary-color))` |
| `--checkbox-soft-color`           | `var(--checkbox-soft-color, white)`                      |
| `--checkbox-soft-bg-color`        | `var(--checkbox-soft-bg-color, var(--secondary-color))`  |
| `--checkbox-size-sm`              | `var(--checkbox-size-sm, 16px)`                          |
| `--checkbox-size-md`              | `var(--checkbox-size-md, 20px)`                          |
| `--checkbox-size-lg`              | `var(--checkbox-size-lg, 22px)`                          |
| `--checkbox-border-radius-sm`     | `var(--checkbox-border-radius-sm, 2px)`                  |
| `--checkbox-border-radius-lg`     | `var(--checkbox-border-radius-lg, 6px)`                  |
| `--checkbox-speed-bg`             | `var(--checkbox-speed-bg, var(--speed-color))`           |
| `--checkbox-speed-color`          | `var(--checkbox-speed-color, var(--speed-color))`        |

Notes:

- `--checkbox-checked-bg-color` falls back to the theme color token `--primary-color`.
- `--checkbox-soft-bg-color` falls back to `--secondary-color`.
- Transitions use component-scoped `--checkbox-speed-*` variables with fallbacks to global `--speed-*` tokens.

### Theming and global configuration

You can provide Checkbox defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {CheckboxVariant, CheckboxSize, CheckboxRadius} from "addon-ui";

export default defineConfig({
    components: {
        checkbox: {
            variant: CheckboxVariant.Classic,
            size: CheckboxSize.Medium,
            radius: CheckboxRadius.Small,
            // Optionally provide default icons
            // checkedIcon: YourCheckIcon,
            // indeterminateIcon: YourIndeterminateIcon,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        checkbox: {
            variant: "soft",
            size: "large",
            radius: "large",
            // checkedIcon: <YourCheckIcon />,
            // indeterminateIcon: <YourIndeterminateIcon />,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Built on Radix UI Checkbox: keyboard accessible (Space toggles), `aria-checked` state handled by the component.
- Provide an accessible name by associating with a visible label or `aria-label`/`aria-labelledby`.
- Use the indeterminate state only for parent/mixed selections and ensure it is communicated via label or context.
- Disabled state is non-interactive and should be visually distinct.
