### Select

Documentation for the Select component and its subcomponents: Select, SelectTrigger, SelectContent, SelectItem, SelectItemText, SelectItemIndicator, SelectIcon, SelectValue. The implementation is built on top of `@radix-ui/react-select` and adds visual features, support for localization (RTL), and global configuration.

See the official Radix documentation: https://www.radix-ui.com/primitives/docs/components/select

#### Import

```ts
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectItemIndicator,
    SelectIcon,
    SelectValue,
} from "addon-ui";
```

#### Basic usage

```tsx
<Select defaultValue="apple">
    <SelectTrigger placeholder="Select a fruit..." icon="➕" />
    <SelectContent>
        <SelectItem value="apple" textValue="Apple" />
        <SelectItem value="banana" textValue="Banana" disabled />
        <SelectItem value="orange" textValue="Orange" />
    </SelectContent>
</Select>
```

---

#### Props: Select (root)

Only the prop name, type, and default are listed below.

| Prop             | Type                         | Default |
| ---------------- | ---------------------------- | ------- |
| `value`          | `string`                     | —       |
| `defaultValue`   | `string`                     | —       |
| `onValueChange`  | `(value: string) => void`    | —       |
| `open`           | `boolean`                    | —       |
| `defaultOpen`    | `boolean`                    | —       |
| `onOpenChange`   | `(open: boolean) => void`    | —       |
| `disabled`       | `boolean`                    | —       |
| `name`           | `string`                     | —       |
| `required`       | `boolean`                    | —       |
| Radix Root props | all `SelectProps` from Radix | —       |

Supports contextual props via the UI provider: `useComponentProps("select")`.

#### Props: SelectTrigger

| Prop                | Type                     | Default |
| ------------------- | ------------------------ | ------- |
| `center`            | `boolean`                | `false` |
| `fullWidth`         | `boolean`                | —       |
| `ellipsis`          | `boolean`                | `true`  |
| `icon`              | `ReactNode`              | —       |
| `placeholder`       | `ReactNode`              | —       |
| `valueProps`        | `SelectValueProps`       | —       |
| `iconProps`         | `SelectIconProps`        | —       |
| Radix Trigger props | all `SelectTriggerProps` | —       |

Supports contextual props: `useComponentProps("selectTrigger")`.

#### Props: SelectContent

| Prop                | Type                         | Default    |
| ------------------- | ---------------------------- | ---------- |
| `arrow`             | `boolean`                    | —          |
| `arrowWidth`        | `number`                     | —          |
| `arrowHeight`       | `number`                     | —          |
| `fullWidth`         | `boolean`                    | `true`     |
| `position`          | `"popper" \| "item-aligned"` | `"popper"` |
| `viewportProps`     | `SelectViewportProps`        | —          |
| `scrollUpButton`    | `ReactNode`                  | —          |
| `scrollDownButton`  | `ReactNode`                  | —          |
| `container`         | `HTMLElement`                | —          |
| Radix Content props | all `SelectContentProps`     | —          |

Supports contextual props: `useComponentProps("selectContent")`.

#### Props: SelectItem

| Prop                 | Type                  | Default |
| -------------------- | --------------------- | ------- |
| `value`              | `string` (required)   | —       |
| `indicator`          | `ReactNode`           | —       |
| `indicatorClassname` | `string`              | —       |
| `textValue`          | `string`              | —       |
| Radix Item props     | all `SelectItemProps` | —       |

Supports contextual props: `useComponentProps("selectItem")`.

#### Props: SelectItemText, SelectItemIndicator, SelectIcon, SelectValue

These components are wrappers around Radix UI primitives and do not have additional custom props.

| Prop        | Type                          | Default |
| ----------- | ----------------------------- | ------- |
| Radix props | all corresponding Radix props | —       |

---

### CSS variables for Select

Only variables actually referenced in `src/components/Select/select.module.scss` are listed, with their exact fallback chains.

| Variable                               | Fallback chain                                                                                      |
| :------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `--select-trigger-color`               | none (define in theme)                                                                              |
| `--select-trigger-bg-color`            | `var(--select-trigger-bg-color, var(--bg-secondary-color))`                                         |
| `--select-trigger-shadow-offset`       | none (define in theme)                                                                              |
| `--select-trigger-shadow-color`        | none (define in theme)                                                                              |
| `--select-trigger-border-width`        | `var(--select-trigger-border-width, 1px)`                                                           |
| `--select-trigger-border-style`        | `var(--select-trigger-border-style, solid)`                                                         |
| `--select-trigger-border-color`        | `var(--select-trigger-border-color, var(--border-color))`                                           |
| `--select-trigger-border-radius`       | `var(--select-trigger-border-radius, 10px)`                                                         |
| `--select-trigger-font-size`           | `var(--select-trigger-font-size, var(--select-font-size, 14px))`                                    |
| `--select-trigger-font-weight`         | `var(--select-trigger-font-weight, 500)`                                                            |
| `--select-trigger-padding`             | `var(--select-trigger-padding, 8px 12px)`                                                           |
| `--select-trigger-height`              | none (define in theme)                                                                              |
| `--select-trigger-gap`                 | `var(--select-trigger-gap, 5px)`                                                                    |
| `--select-placeholder-color`           | `var(--select-placeholder-color, var(--placeholder-color))`                                         |
| `--select-trigger-shadow-offset-hover` | none (define in theme)                                                                              |
| `--select-trigger-border-width-hover`  | `var(--select-trigger-border-width-hover, var(--select-trigger-border-width, 1px))`                 |
| `--select-trigger-border-color-hover`  | `var(--select-trigger-border-color-hover, var(--select-trigger-border-color, var(--border-color)))` |
| `--select-content-bg-color`            | `var(--select-content-bg-color, var(--bg-primary-color))`                                           |
| `--select-content-border-radius`       | `var(--select-content-border-radius, 8px)`                                                          |
| `--select-content-shadow-offset`       | `var(--select-content-shadow-offset, 0 0 5px 0)`                                                    |
| `--select-content-shadow-color`        | `var(--select-content-shadow-color, rgba(0, 0, 0, 0.25))`                                           |
| `--select-content-height`              | none (define in theme)                                                                              |
| `--select-content-max-height`          | `var(--select-content-max-height, var(--radix-select-content-available-height))`                    |
| `--select-content-full-width`          | `var(--select-content-full-width, var(--radix-select-trigger-width))`                               |
| `--select-viewport-padding`            | `var(--select-viewport-padding, 5px 0)`                                                             |
| `--select-item-font-size`              | `var(--select-item-font-size, var(--select-font-size, 14px))`                                       |
| `--select-item-font-weight`            | `var(--select-item-font-weight, 400)`                                                               |
| `--select-item-color`                  | `var(--select-item-color, var(--text-primary-color))`                                               |
| `--select-item-border-radius`          | none (define in theme)                                                                              |
| `--select-item-height`                 | none (define in theme)                                                                              |
| `--select-item-padding`                | `var(--select-item-padding, 10px)`                                                                  |
| `--select-item-checked-font-weight`    | `var(--select-item-checked-font-weight, 600)`                                                       |
| `--select-item-checked-color`          | none (define in theme)                                                                              |
| `--select-item-checked-bg-color`       | `var(--select-item-checked-bg-color, var(--bg-secondary-color))`                                    |
| `--select-item-disabled-opacity`       | `var(--select-item-disabled-opacity, 0.7)`                                                          |
| `--select-item-disabled-color`         | `var(--select-item-disabled-color, var(--text-disabled-color))`                                     |
| `--select-item-disabled-bg-color`      | none (define in theme)                                                                              |
| `--select-item-highlighted-color`      | `var(--select-item-highlighted-color, var(--text-primary-color))`                                   |
| `--select-item-highlighted-bg-color`   | `var(--select-item-highlighted-bg-color, var(--bg-secondary-color))`                                |
| `--select-scroll-btn-height`           | `var(--select-scroll-btn-height, 25px)`                                                             |
| `--select-scroll-btn-color`            | `var(--select-scroll-btn-color, var(--text-primary-color))`                                         |
| `--select-scroll-btn-bg-color`         | `var(--select-scroll-btn-bg-color, var(--select-content-bg-color, var(--bg-primary-color)))`        |
| `--select-scroll-btn-cursor`           | `var(--select-scroll-btn-cursor, default)`                                                          |
| `--select-scroll-btn-hover-bg-color`   | `var(--select-scroll-btn-hover-bg-color, var(--bg-secondary-color))`                                |
| `--select-arrow-bg-color`              | `var(--select-arrow-bg-color, var(--select-content-bg-color, var(--bg-primary-color)))`             |

---

### Accessibility (A11y)

Components inherit behavior and ARIA attributes from Radix Select: keyboard navigation, correct roles, and states. It adheres to the [WAI-ARIA Select Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/selectbox/). Supports RTL automatically via the `useLocale` hook.

Useful: https://www.radix-ui.com/primitives/docs/components/select

---

### Usage notes

- The component supports global configuration via `ui.config.ts`.
- `SelectContent` can be customized with `arrow` and `fullWidth` props.
- `SelectTrigger` supports `ellipsis` for long text and `center` alignment.
