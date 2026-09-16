### Button

The Button component is a customizable button with style variants, colors, sizes, and corner radii. It supports theming via CSS variables and default props via `UIProvider`/`ui.config.ts`.

Use `className` for the button and `childrenClassName`, `beforeClassName` or
`afterClassName` for its inner slots. See the [custom button example](customization.md#a-custom-button)
for CSS variables and ordinary class overrides of the library's cascade layers.

#### Import and basic usage

```tsx
import React from "react";
import {Button, ButtonVariant, ButtonColor, ButtonSize, ButtonRadius} from "addon-ui";

export function Example() {
    return (
        <>
            <Button>Click me</Button>

            <Button variant={ButtonVariant.Contained} color={ButtonColor.Primary}>
                Primary Contained
            </Button>

            <Button variant={ButtonVariant.Outlined} color={ButtonColor.Secondary} size={ButtonSize.Medium}>
                Secondary Outlined
            </Button>

            <Button variant={ButtonVariant.Text} radius={ButtonRadius.Full}>
                Text Full Radius
            </Button>
        </>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop                | Type                                                           | Default       |
| ------------------- | -------------------------------------------------------------- | ------------- |
| `variant`           | `'contained' \| 'outlined' \| 'text'`                          | `'contained'` |
| `color`             | `'primary' \| 'secondary' \| 'accent' \| 'error' \| 'success'` | —             |
| `size`              | `'small' \| 'medium' \| 'large'`                               | —             |
| `radius`            | `'small' \| 'medium' \| 'large' \| 'full'`                     | —             |
| `before`            | `ReactNode`                                                    | —             |
| `after`             | `ReactNode`                                                    | —             |
| `beforeClassName`   | `string`                                                       | —             |
| `afterClassName`    | `string`                                                       | —             |
| `childrenClassName` | `string`                                                       | —             |
| `disabled`          | `boolean`                                                      | `false`       |
| HTML button attrs   | all standard `button` attributes                               | —             |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Variants, colors, sizes, radii (enums)

```ts
// Variants
ButtonVariant.Contained;
ButtonVariant.Outlined;
ButtonVariant.Text;

// Colors
ButtonColor.Primary;
ButtonColor.Secondary;
ButtonColor.Accent;
ButtonColor.Error;
ButtonColor.Success;

// Sizes
ButtonSize.Small;
ButtonSize.Medium;
ButtonSize.Large;

// Radius
ButtonRadius.Small;
ButtonRadius.Medium;
ButtonRadius.Large;
ButtonRadius.Full;
```

### CSS variables for Button

Only variables actually referenced in `src/components/Button/button.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                                   | Fallback chain                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `--button-font-family`                     | `var(--button-font-family, var(--font-family)), sans-serif`                                         |
| `--button-font-weight`                     | `var(--button-font-weight, 500)`                                                                    |
| `--button-font-size`                       | `var(--button-font-size, var(--font-size, 14px))`                                                   |
| `--button-letter-spacing`                  | `var(--button-letter-spacing, 0.5px)`                                                               |
| `--button-line-height`                     | `var(--button-line-height, var(--line-height, 1rem))`                                               |
| `--button-height`                          | `var(--button-height, 34px)`                                                                        |
| `--button-border-radius`                   | `var(--button-border-radius, 10px)`                                                                 |
| `--button-padding`                         | `var(--button-padding, 0 16px)`                                                                     |
| `--button-speed-color`                     | `var(--button-speed-color, var(--speed-color))`                                                     |
| `--button-speed-border-color`              | `var(--button-speed-border-color, var(--speed-color))`                                              |
| `--button-speed-bg`                        | `var(--button-speed-bg, var(--speed-color))`                                                        |
| `--button-speed-transform`                 | `var(--button-speed-transform, var(--speed-sm))`                                                    |
| `--button-scale`                           | `var(--button-scale, 0.98)`                                                                         |
| `--button-disabled-opacity`                | `var(--button-disabled-opacity, 0.75)`                                                              |
| `--button-contained-text-color`            | `var(--button-contained-text-color, var(--text-primary-color))`                                     |
| `--button-contained-bg-color`              | `var(--button-contained-bg-color, var(--bg-secondary-color))`                                       |
| `--button-contained-primary-text-color`    | `var(--button-contained-primary-text-color, #fff)`                                                  |
| `--button-contained-secondary-text-color`  | `var(--button-contained-secondary-text-color, #fff)`                                                |
| `--button-contained-accent-text-color`     | `var(--button-contained-accent-text-color, #fff)`                                                   |
| `--button-contained-error-text-color`      | `var(--button-contained-error-text-color, #fff)`                                                    |
| `--button-contained-success-text-color`    | `var(--button-contained-success-text-color, #fff)`                                                  |
| `--button-outlined-text-color`             | `var(--button-outlined-text-color, var(--text-primary-color))`                                      |
| `--button-outlined-border-color`           | `var(--button-outlined-border-color, var(--button-outlined-text-color, var(--text-primary-color)))` |
| `--button-outlined-bg-color-hover`         | none (define in theme)                                                                              |
| `--button-outlined-bg-color-active`        | none (define in theme)                                                                              |
| `--button-outlined-border-primary-color`   | `var(--button-outlined-border-primary-color, var(--primary-color))`                                 |
| `--button-outlined-border-secondary-color` | `var(--button-outlined-border-secondary-color, var(--secondary-color))`                             |
| `--button-outlined-border-accent-color`    | `var(--button-outlined-border-accent-color, var(--accent-color-color))`                             |
| `--button-outlined-border-error-color`     | `var(--button-outlined-border-error-color, var(--error-color))`                                     |
| `--button-outlined-border-success-color`   | `var(--button-outlined-border-success-color, var(--success-color))`                                 |
| `--button-text-text-color`                 | `var(--button-text-text-color, var(--text-primary-color))`                                          |
| `--button-text-text-color-hover`           | `var(--button-text-text-color-hover, var(--text-secondary-color))`                                  |
| `--button-text-text-color-active`          | `var(--button-text-text-color-active, var(--text-secondary-color))`                                 |
| `--button-height-sm`                       | `var(--button-height-sm, 24px)`                                                                     |
| `--button-height-md`                       | `var(--button-height-md, 44px)`                                                                     |
| `--button-height-lg`                       | `var(--button-height-lg, 54px)`                                                                     |
| `--button-font-size-sm`                    | Contextual defaults: `12px` (small), `16px` (medium), `18px` (large)                                |
| `--button-border-radius-sm`                | `var(--button-border-radius-sm, 5px)`                                                               |
| `--button-border-radius-md`                | `var(--button-border-radius-md, 12px)`                                                              |
| `--button-border-radius-lg`                | `var(--button-border-radius-lg, 15px)`                                                              |
| `--button-max-width`                       | `var(--button-max-width, 160px)`                                                                    |
| `--button-children-z-index`                | `var(--button-children-z-index, 3)`                                                                 |
| `--button-children-line-height`            | `var(--button-children-line-height, inherit)`                                                       |

Notes:

- In the `--full-radius` modifier, the border-radius is set to `var(--button-height, 999px)` (it reuses `--button-height` as the variable with a default of `999px`).
- Theme variables seen within fallbacks include `--font-family`, `--font-size`, `--line-height`, `--speed-color`, `--speed-sm`, `--bg-primary-color`, `--bg-secondary-color`, `--text-primary-color`, `--text-secondary-color`, and color tokens `--primary-color`, `--secondary-color`, `--accent-color`, `--error-color`, `--success-color`.
- Modifiers like `.button--primary-color` apply `--primary-color` (etc.) directly; those aren’t fallbacks but direct color assignments for that modifier.

### Theming and global configuration

You can provide Button defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";
import {ButtonColor, ButtonRadius, ButtonVariant} from "addon-ui";

export default defineConfig({
    components: {
        button: {
            variant: ButtonVariant.Contained,
            color: ButtonColor.Primary,
            radius: ButtonRadius.Medium,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        button: {
            variant: "outlined",
            color: "primary",
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- Built on the native `button` element; supports standard `aria-*` attributes.
- Keyboard accessible: activatable with Enter/Space, visible focus.
- `disabled` prevents focus and click interactions.
