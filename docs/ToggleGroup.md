### ToggleGroup

Documentation for the ToggleGroup component and its subcomponents: ToggleGroup, ToggleGroupItem, ToggleGroupIndicator. The implementation is built on top of `@radix-ui/react-toggle-group` and adds visual features, support for global configuration, and additional props.

See the official Radix documentation: https://www.radix-ui.com/primitives/docs/components/toggle-group

#### Import

```ts
import {ToggleGroup, ToggleGroupItem, ToggleGroupIndicator} from "addon-ui";
```

#### Basic usage

```tsx
<ToggleGroup type="single" defaultValue="1">
    <ToggleGroupItem value="1">
        <Button>
            Option 1<ToggleGroupIndicator>✅</ToggleGroupIndicator>
        </Button>
    </ToggleGroupItem>
    <ToggleGroupItem value="2">
        <Button>
            Option 2<ToggleGroupIndicator>✅</ToggleGroupIndicator>
        </Button>
    </ToggleGroupItem>
</ToggleGroup>
```

---

#### Props: ToggleGroup (Root)

Only the prop name, type, and default are listed below.

| Prop             | Type                                                       | Default |
| ---------------- | ---------------------------------------------------------- | ------- |
| `type`           | `"single" \| "multiple"` (required)                        | —       |
| `value`          | `string \| string[]`                                       | —       |
| `defaultValue`   | `string \| string[]`                                       | —       |
| `onValueChange`  | `(value: string \| string[]) => void`                      | —       |
| `disabled`       | `boolean`                                                  | —       |
| `rovingFocus`    | `boolean`                                                  | `true`  |
| `orientation`    | `"horizontal" \| "vertical" \| undefined`                  | —       |
| `dir`            | `"ltr" \| "rtl" \| undefined`                              | —       |
| `loop`           | `boolean`                                                  | `true`  |
| Radix Root props | all `ToggleGroupSingleProps` or `ToggleGroupMultipleProps` | —       |

Supports contextual props via the UI provider: `useComponentProps("toggleGroup")`.

#### Props: ToggleGroupItem

| Prop             | Type                       | Default |
| ---------------- | -------------------------- | ------- |
| `value`          | `string` (required)        | —       |
| `disabled`       | `boolean`                  | —       |
| `asChild`        | `boolean`                  | `true`  |
| Radix Item props | all `ToggleGroupItemProps` | —       |

Supports contextual props: `useComponentProps("toggleGroupItem")`.

#### Props: ToggleGroupIndicator

This component is a wrapper that displays its children only when its parent `ToggleGroupItem` is in the "on" state.

| Prop       | Type                       | Default |
| :--------- | :------------------------- | :------ |
| `children` | `ReactNode`                | —       |
| —          | all `HTMLDivElement` props | —       |

---

### CSS variables for ToggleGroup

Only variables actually referenced in `src/components/ToggleGroup/toggleGroup.module.scss` are listed, with their exact fallback chains.

| Variable                            | Fallback chain                                              |
| :---------------------------------- | :---------------------------------------------------------- |
| `--toggle-group-gap`                | `var(--toggle-group-gap, 10px)`                             |
| `--toggle-group-padding`            | `var(--toggle-group-padding, 0)`                            |
| `--toggle-group-speed-bg`           | `var(--toggle-group-speed-bg, var(--speed-color))`          |
| `--toggle-group-item-speed-bg`      | `var(--toggle-group-item-speed-bg, var(--speed-color))`     |
| `--toggle-group-item-speed-color`   | `var(--toggle-group-item-speed-color, var(--speed-color))`  |
| `--toggle-group-item-checked-bg`    | `var(--toggle-group-item-checked-bg, var(--primary-color))` |
| `--toggle-group-item-checked-color` | none (define in theme)                                      |

---

### Accessibility (A11y)

Components inherit behavior and ARIA attributes from Radix Toggle Group: keyboard navigation (arrow keys), roving focus, and states. It adheres to the [WAI-ARIA Toggle Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

Useful: https://www.radix-ui.com/primitives/docs/components/toggle-group

---

### Usage notes

- The component supports global configuration via `ui.config.ts`.
- `ToggleGroupItem` has `asChild` set to `true` by default, making it easy to use with custom button components.
- `ToggleGroupIndicator` is specifically styled to show/hide based on the item state.
