### TextField

The TextField component provides a customizable single‑line text input. It supports style variants, sizes, corner radii, validation accents, full‑width mode, before/after slots, theming via CSS variables, and default props via `UIProvider`/`ui.config.ts`.

#### Import and basic usage

```tsx
import React from "react";
import {TextField, TextFieldVariant, TextFieldSize, TextFieldRadius, TextFieldAccent} from "addon-ui";

export function Example() {
    const [value, setValue] = React.useState("");
    const ref = React.useRef<{
        focus(): void;
        select(): void;
        getValue(): string | undefined;
        setValue(v: string | number | undefined): void;
    }>(null);

    return (
        <div style={{display: "grid", gap: 16}}>
            {/* Uncontrolled */}
            <TextField placeholder="Type here..." />

            {/* Controlled */}
            <TextField value={value} onChange={e => setValue(e.currentTarget.value)} placeholder="Controlled" />

            {/* Variants */}
            <TextField variant={TextFieldVariant.Regular} placeholder="Regular" />
            <TextField variant={TextFieldVariant.Outlined} placeholder="Outlined" />
            <TextField variant={TextFieldVariant.Filled} placeholder="Filled" />

            {/* Sizes */}
            <TextField customSize={TextFieldSize.Small} placeholder="Small" />
            <TextField customSize={TextFieldSize.Medium} placeholder="Medium" />
            <TextField customSize={TextFieldSize.Large} placeholder="Large" />

            {/* Radii */}
            <TextField radius={TextFieldRadius.None} placeholder="No radius" />
            <TextField radius={TextFieldRadius.Small} placeholder="Small radius" />
            <TextField radius={TextFieldRadius.Medium} placeholder="Medium radius" />
            <TextField radius={TextFieldRadius.Large} placeholder="Large radius" />
            <TextField radius={TextFieldRadius.Full} placeholder="Full pill radius" />

            {/* Accents (validation states) */}
            <TextField accent={TextFieldAccent.Success} placeholder="Success" />
            <TextField accent={TextFieldAccent.Error} placeholder="Error" />

            {/* Strict numeric input */}
            <TextField type="number" strict placeholder="Only numbers allowed" />

            {/* Full width and content slots */}
            <TextField fullWidth before={<span>+1</span>} after={<span>USD</span>} placeholder="With addons" />

            {/* Type and ref actions */}
            <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                <TextField ref={ref as any} type="password" placeholder="Password" />
                <button onClick={() => ref.current?.focus()}>Focus</button>
                <button onClick={() => ref.current?.select()}>Select</button>
                <button onClick={() => ref.current?.setValue("Hello")}>Set value</button>
                <button onClick={() => alert(ref.current?.getValue())}>Get value</button>
            </div>
        </div>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop              | Type                                                                                                           | Default     |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| `variant`         | `'regular' \| 'outlined' \| 'filled'`                                                                          | `'regular'` |
| `accent`          | `'success' \| 'error'`                                                                                         | —           |
| `radius`          | `'none' \| 'small' \| 'medium' \| 'large' \| 'full'`                                                           | —           |
| `customSize`      | `'small' \| 'medium' \| 'large'`                                                                               | —           |
| `label`           | `string`                                                                                                       | —           |
| `fullWidth`       | `boolean`                                                                                                      | —           |
| `before`          | `ReactNode`                                                                                                    | —           |
| `after`           | `ReactNode`                                                                                                    | —           |
| `inputClassName`  | `string`                                                                                                       | —           |
| `afterClassName`  | `string`                                                                                                       | —           |
| `beforeClassName` | `string`                                                                                                       | —           |
| `type`            | `ComponentProps<'input'>['type']`                                                                              | `'text'`    |
| `strict`          | `boolean`                                                                                                      | `false`     |
| HTML input attrs  | all standard `input` attributes (e.g., `value`, `defaultValue`, `onChange`, `placeholder`, `name`, `id`, etc.) | —           |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Variants, sizes, radii, accents (enums)

```ts
// Variants
TextFieldVariant.Regular;
TextFieldVariant.Outlined;
TextFieldVariant.Filled;

// Sizes
TextFieldSize.Small;
TextFieldSize.Medium;
TextFieldSize.Large;

// Radius
TextFieldRadius.None;
TextFieldRadius.Small;
TextFieldRadius.Medium;
TextFieldRadius.Large;
TextFieldRadius.Full;

// Accents
TextFieldAccent.Success;
TextFieldAccent.Error;
```

### CSS variables for TextField

Only variables actually referenced in `src/components/TextField/text-field.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                             | Fallback chain                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `--text-field-gap`                   | `var(--text-field-gap, 0.3em)`                                                              |
| `--text-field-font-family`           | `var(--text-field-font-family, var(--font-family)), sans-serif`                             |
| `--text-field-font-weight`           | `var(--text-field-font-weight, 400)`                                                        |
| `--text-field-font-size`             | `var(--text-field-font-size, 14px)`                                                         |
| `--text-field-letter-spacing`        | `var(--text-field-letter-spacing, 0.5px)`                                                   |
| `--text-field-line-height`           | `var(--text-field-line-height, var(--line-height, 1 rem))`                                  |
| `--text-field-padding`               | `var(--text-field-padding, 8px 12px)`                                                       |
| `--text-field-border-radius`         | `var(--text-field-border-radius, 8px)`                                                      |
| `--text-field-speed-border-color`    | `var(--text-field-speed-border-color, var(--speed-color))`                                  |
| `--text-field-speed-box-shadow`      | `var(--text-field-speed-box-shadow, var(--speed-color))`                                    |
| `--text-field-speed-bg`              | `var(--text-field-speed-bg, var(--speed-color))`                                            |
| `--text-field-focus-border-color`    | `var(--text-field-focus-border-color, color-mix(in srgb, white 40%, var(--primary-color)))` |
| `--text-field-focus-shadow`          | `var(--text-field-focus-shadow, 0 0 4px var(--primary-color))`                              |
| `--text-field-disabled-opacity`      | `var(--text-field-disabled-opacity, 0.7)`                                                   |
| `--text-field-speed-color`           | `var(--text-field-speed-color, var(--speed-color))`                                         |
| `--text-field-placeholder-color`     | `var(--text-field-placeholder-color, var(--text-secondary-color))`                          |
| `--text-field-regular-color`         | `var(--text-field-regular-color, var(--text-field-color, var(--text-primary-color)))`       |
| `--text-field-color`                 | `var(--text-field-color)` (none)                                                            |
| `--text-field-regular-bg-color`      | `var(--text-field-regular-bg-color, var(--text-field-bg-color, var(--bg-secondary-color)))` |
| `--text-field-bg-color`              | `var(--text-field-bg-color)` (none)                                                         |
| `--text-field-regular-border-width`  | `var(--text-field-regular-border-width, var(--text-field-border-width, 1px))`               |
| `--text-field-border-width`          | `var(--text-field-border-width, 1px)`                                                       |
| `--text-field-regular-border-color`  | `var(--text-field-regular-border-color, var(--border-color))`                               |
| `--border-color`                     | `var(--border-color)` (none)                                                                |
| `--text-field-outlined-color`        | `var(--text-field-outlined-color, var(--text-field-color, var(--text-primary-color)))`      |
| `--text-field-outlined-border-width` | `var(--text-field-outlined-border-width, var(--text-field-border-width, 1px))`              |
| `--text-field-outlined-border-color` | `var(--text-field-outlined-border-color, var(--border-color))`                              |
| `--text-field-filled-color`          | `var(--text-field-filled-color, var(--text-field-color, var(--text-primary-color)))`        |
| `--text-field-filled-bg-color`       | `var(--text-field-filled-bg-color, var(--text-field-bg-color, var(--bg-secondary-color)))`  |
| `--text-field-border-radius-sm`      | `var(--text-field-border-radius-sm, 5px)`                                                   |
| `--text-field-border-radius-md`      | `var(--text-field-border-radius-md, 10px)`                                                  |
| `--text-field-border-radius-lg`      | `var(--text-field-border-radius-lg, 15px)`                                                  |
| `--text-field-border-radius-full`    | `var(--text-field-border-radius-full, 999px)`                                               |
| `--text-field-padding-sm`            | `var(--text-field-padding-sm, 6px 10px)`                                                    |
| `--text-field-padding-md`            | `var(--text-field-padding-md, 10px 14px)`                                                   |
| `--text-field-padding-lg`            | `var(--text-field-padding-lg, 12px 16px)`                                                   |
| `--text-field-font-size-sm`          | `var(--text-field-font-size-sm, 12px)`                                                      |
| `--text-field-font-size-md`          | `var(--text-field-font-size-md, 16px)`                                                      |
| `--text-field-font-size-lg`          | `var(--text-field-font-size-lg, 18px)`                                                      |
| `--text-field-success-color`         | `var(--text-field-success-color, var(--success-color))`                                     |
| `--text-field-accent-border-width`   | `var(--text-field-accent-border-width, 2px)`                                                |
| `--text-field-error-color`           | `var(--text-field-error-color, var(--error-color))`                                         |

Notes:

- Accents add a stronger border (`--text-field-accent-border-width`) and shadow using success/error colors. If the component variables aren’t defined, they fall back to theme tokens like `--success-color` and `--error-color`.
- Size variants use their own font-size variables (`--text-field-font-size-sm`, `--text-field-font-size-md`, `--text-field-font-size-lg`) for more granular control.

### Theming and global configuration

Provide TextField defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {TextFieldVariant, TextFieldSize, TextFieldRadius, TextFieldAccent} from "addon-ui";

export default defineConfig({
    components: {
        textField: {
            variant: TextFieldVariant.Outlined,
            customSize: TextFieldSize.Medium,
            radius: TextFieldRadius.Small,
            // You may predefine typical attributes as defaults
            // type: "text",
            // fullWidth: false,
            // placeholder: "Enter text",
            // accent: TextFieldAccent.Success,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        textField: {
            variant: "filled",
            customSize: "large",
            radius: "full",
            fullWidth: true,
            // type: "password",
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- The component renders a native `<input>` inside a wrapper; provide a programmatic label. The `label` prop maps to `aria-label` on both wrapper and input.
- For a visible label, associate a `<label htmlFor>` with the input by passing a matching `id` to TextField.
- Ensure sufficient contrast for text and backgrounds, including disabled and error states.

---

### Usage notes

- **Strict Numeric Input**: When `type="number"` and `strict` is enabled, the component uses a custom normalization logic to ensure only valid numeric characters are entered. It also sets `inputMode="decimal"` and uses `type="text"` internally to provide a more consistent experience across browsers and devices (avoiding some native number input bugs).
