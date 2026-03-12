### Popover

Documentation for the Popover component and its subcomponents: Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose. The implementation is built on top of `@radix-ui/react-popover` and adds visual features, support for global configuration, and additional props.

See the official Radix documentation: https://www.radix-ui.com/primitives/docs/components/popover

#### Import

```ts
import {Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose} from "addon-ui";
```

#### Basic usage

```tsx
<Popover>
    <PopoverTrigger>Open Popover</PopoverTrigger>
    <PopoverContent arrow>
        <p>Popover content goes here.</p>
        <PopoverClose>Close</PopoverClose>
    </PopoverContent>
</Popover>
```

---

#### Props: Popover (Root)

Only the prop name, type, and default are listed below.

| Prop             | Type                          | Default |
| ---------------- | ----------------------------- | ------- |
| `defaultOpen`    | `boolean`                     | —       |
| `open`           | `boolean`                     | —       |
| `onOpenChange`   | `(open: boolean) => void`     | —       |
| `modal`          | `boolean`                     | —       |
| Radix Root props | all `PopoverProps` from Radix | —       |

Supports contextual props via the UI provider: `useComponentProps("popover")`.

#### Props: PopoverTrigger

| Prop                | Type                      | Default |
| ------------------- | ------------------------- | ------- |
| `center`            | `boolean`                 | `false` |
| Radix Trigger props | all `PopoverTriggerProps` | —       |

Supports contextual props: `useComponentProps("popoverTrigger")`.

#### Props: PopoverContent

| Prop                | Type                      | Default |
| ------------------- | ------------------------- | ------- |
| `maxWidth`          | `number`                  | —       |
| `minWidth`          | `number`                  | —       |
| `fullWidth`         | `boolean`                 | —       |
| `arrow`             | `boolean`                 | —       |
| `arrowWidth`        | `number`                  | —       |
| `arrowHeight`       | `number`                  | —       |
| `overlay`           | `boolean`                 | —       |
| `overlayClassname`  | `string`                  | —       |
| `container`         | `HTMLElement`             | —       |
| Radix Content props | all `PopoverContentProps` | —       |

Supports contextual props: `useComponentProps("popoverContent")`.

#### Props: PopoverAnchor

| Prop               | Type                     | Default |
| ------------------ | ------------------------ | ------- |
| Radix Anchor props | all `PopoverAnchorProps` | —       |

Supports contextual props: `useComponentProps("popoverAnchor")`.

#### Props: PopoverClose

| Prop              | Type                    | Default |
| ----------------- | ----------------------- | ------- |
| Radix Close props | all `PopoverCloseProps` | —       |

Supports contextual props: `useComponentProps("popoverClose")`.

---

### CSS variables for Popover

Only variables actually referenced in `src/components/Popover/popover.module.scss` are listed, with their exact fallback chains.

| Variable                                | Fallback chain                                                                                        |
| :-------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `--popover-overlay-bg`                  | `var(--popover-overlay-bg, var(--overlay-bg, rgba(0, 0, 0, 0.5)))`                                    |
| `--popover-trigger-color`               | none (define in theme)                                                                                |
| `--popover-trigger-bg-color`            | `var(--popover-trigger-bg-color, var(--bg-secondary-color))`                                          |
| `--popover-trigger-shadow-offset`       | none (define in theme)                                                                                |
| `--popover-trigger-shadow-color`        | none (define in theme)                                                                                |
| `--popover-trigger-border-width`        | `var(--popover-trigger-border-width, 1px)`                                                            |
| `--popover-trigger-border-style`        | `var(--popover-trigger-border-style, solid)`                                                          |
| `--popover-trigger-border-color`        | `var(--popover-trigger-border-color, var(--border-color))`                                            |
| `--popover-trigger-border-radius`       | `var(--popover-trigger-border-radius, 10px)`                                                          |
| `--popover-trigger-font-size`           | `var(--popover-trigger-font-size, var(--popover-font-size, 14px))`                                    |
| `--popover-trigger-font-weight`         | `var(--popover-trigger-font-weight, 500)`                                                             |
| `--popover-trigger-padding`             | `var(--popover-trigger-padding, 8px 12px)`                                                            |
| `--popover-trigger-height`              | none (define in theme)                                                                                |
| `--popover-trigger-gap`                 | `var(--popover-trigger-gap, 5px)`                                                                     |
| `--popover-trigger-shadow-offset-hover` | none (define in theme)                                                                                |
| `--popover-trigger-border-width-hover`  | `var(--popover-trigger-border-width-hover, var(--popover-trigger-border-width, 1px))`                 |
| `--popover-trigger-border-color-hover`  | `var(--popover-trigger-border-color-hover, var(--popover-trigger-border-color, var(--border-color)))` |
| `--popover-content-padding`             | `var(--popover-content-padding, 16px)`                                                                |
| `--popover-content-bg-color`            | `var(--popover-content-bg-color, var(--bg-primary-color))`                                            |
| `--popover-content-border-radius`       | `var(--popover-content-border-radius, 8px)`                                                           |
| `--popover-content-shadow-offset`       | `var(--popover-content-shadow-offset, 0 0 5px 0)`                                                     |
| `--popover-content-shadow-color`        | `var(--popover-content-shadow-color, rgba(0, 0, 0, 0.25))`                                            |
| `--popover-content-height`              | none (define in theme)                                                                                |
| `--popover-content-max-height`          | `var(--popover-content-max-height, var(--radix-popover-content-available-height))`                    |
| `--popover-content-full-width`          | `var(--popover-content-full-width, var(--radix-popover-content-available-width))`                     |
| `--popover-arrow-bg-color`              | `var(--popover-arrow-bg-color, var(--popover-content-bg-color, var(--bg-primary-color)))`             |
| `--popover-speed-color`                 | `var(--popover-speed-color, var(--speed-color))`                                                      |
| `--popover-speed-background`            | `var(--popover-speed-background, var(--speed-color))`                                                 |
| `--popover-speed-shadow`                | `var(--popover-speed-shadow, var(--speed-color))`                                                     |
| `--popover-speed-border-color`          | `var(--popover-speed-border-color, var(--speed-color))`                                               |

---

### Accessibility (A11y)

Components inherit behavior and ARIA attributes from Radix Popover: keyboard navigation, correct roles, and states. It adheres to the [WAI-ARIA Popover Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/popover/).

Useful: https://www.radix-ui.com/primitives/docs/components/popover

---

### Usage notes

- The component supports global configuration via `ui.config.ts`.
- `PopoverContent` can be customized with `arrow`, `fullWidth`, and `overlay` props.
- `PopoverTrigger` supports `center` alignment.
