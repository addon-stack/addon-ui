### Tabs

Documentation for the Tabs component and its subcomponents: Tabs, TabsList, TabsTrigger, TabsContent. The implementation is built on top of `@radix-ui/react-tabs` and adds visual features (active tab indicator, rounded edges, badges, etc.).

See the official Radix documentation: https://www.radix-ui.com/primitives/docs/components/tabs

#### Import

```ts
import {Tabs, TabsList, TabsTrigger, TabsContent} from "addon-ui";
```

#### Basic usage

```tsx
<Tabs defaultValue="general">
    <TabsList indicator roundedEdges>
        <TabsTrigger value="general" before={2}>
            General
        </TabsTrigger>
        <TabsTrigger value="advanced" after={"!"}>
            Advanced
        </TabsTrigger>
        <TabsTrigger value="about" disabled>
            About
        </TabsTrigger>
    </TabsList>

    <TabsContent value="general">General content</TabsContent>
    <TabsContent value="advanced">Advanced content</TabsContent>
    <TabsContent value="about">About content</TabsContent>
</Tabs>
```

---

#### Props: Tabs (root)

Only the prop name, type, and default are listed below.

| Prop             | Type                                             | Default |
| ---------------- | ------------------------------------------------ | ------- |
| `reverse`        | `boolean`                                        | —       |
| Radix Root props | all `TabsProps` from Radix, except `orientation` | —       |

Supports contextual props via the UI provider: `useComponentProps("tabs")`.

#### Props: TabsList

| Prop                 | Type                | Default |
| -------------------- | ------------------- | ------- |
| `separator`          | `boolean`           | `true`  |
| `indicator`          | `boolean`           | `true`  |
| `roundedEdges`       | `boolean`           | —       |
| `indicatorClassname` | `string`            | —       |
| Radix List props     | all `TabsListProps` | —       |

TabsList automatically measures the active trigger and smoothly moves the indicator using `ResizeObserver` and `MutationObserver`.

Supports contextual props: `useComponentProps("tabsList")`.

#### Props: TabsTrigger

| Prop                | Type                   | Default |
| ------------------- | ---------------------- | ------- |
| `before`            | `number \| string`     | —       |
| `after`             | `number \| string`     | —       |
| `beforeClassname`   | `string`               | —       |
| `afterClassname`    | `string`               | —       |
| `asChild`           | `boolean`              | `true`  |
| Radix Trigger props | all `TabsTriggerProps` | —       |

Supports contextual props: `useComponentProps("tabsTrigger")`.

#### Props: TabsContent

| Prop                | Type                   | Default |
| ------------------- | ---------------------- | ------- |
| Radix Content props | all `TabsContentProps` | —       |

Supports contextual props: `useComponentProps("tabsContent")`.

---

### CSS variables for Tabs

Only variables actually referenced in `src/components/Tabs/tabs.module.scss` are listed, with their exact fallback chains.

| Variable                               | Fallback chain                                                    |
| -------------------------------------- | ----------------------------------------------------------------- |
| `--tabs-list-border-width`             | `var(--tabs-list-border-width, 1px)`                              |
| `--tabs-list-border-color`             | `var(--tabs-list-border-color, var(--separator-color))`           |
| `--tabs-trigger-padding`               | `var(--tabs-trigger-padding, 10px)`                               |
| `--tabs-trigger-height`                | `var(--tabs-trigger-height, 40px)`                                |
| `--tabs-trigger-font-size`             | `var(--tabs-trigger-font-size, 14px)`                             |
| `--tabs-trigger-font-family`           | `var(--tabs-trigger-font-family, var(--font-family))`             |
| `--tabs-trigger-font-weight`           | `var(--tabs-trigger-font-weight, 400)`                            |
| `--tabs-trigger-font-weight-active`    | `var(--tabs-trigger-font-weight-active, 600)`                     |
| `--tabs-trigger-color`                 | `var(--tabs-trigger-color, var(--text-primary-color))`            |
| `--tabs-trigger-dissabled-opacity`     | `var(--tabs-trigger-dissabled-opacity, 0.6)`                      |
| `--tabs-trigger-badge-min-width`       | `var(--tabs-trigger-badge-min-width, 18px)`                       |
| `--tabs-trigger-badge-font-size`       | `var(--tabs-trigger-badge-font-size, 12px)`                       |
| `--tabs-trigger-badge-font-weight`     | `var(--tabs-trigger-badge-font-weight, 700)`                      |
| `--tabs-trigger-badge-padding`         | `var(--tabs-trigger-badge-padding, 2px 4px)`                      |
| `--tabs-trigger-badge-radius`          | `var(--tabs-trigger-badge-radius, 4px)`                           |
| `--tabs-trigger-badge-color`           | `var(--tabs-trigger-badge-color, var(--text-secondary-color))`    |
| `--tabs-trigger-badge-bg-color`        | `var(--tabs-trigger-badge-bg-color, var(--bg-secondary-color))`   |
| `--tabs-trigger-badge-active-color`    | `var(--tabs-trigger-badge-active-color, white)`                   |
| `--tabs-trigger-badge-active-bg-color` | `var(--tabs-trigger-badge-active-bg-color, var(--primary-color))` |
| `--tabs-trigger-gap`                   | `var(--tabs-trigger-gap, 4px)`                                    |
| `--tabs-indicator-size`                | `var(--tabs-indicator-size, 4px)`                                 |
| `--tabs-indicator-color`               | `var(--tabs-indicator-color, var(--primary-color))`               |
| `--tabs-indicator-radius`              | `var(--tabs-indicator-radius, 10px)`                              |
| `--tabs-speed-border-color`            | `var(--tabs-speed-border-color, var(--speed-color))`              |
| `--tabs-speed-color`                   | `var(--tabs-speed-color, var(--speed-color))`                     |
| `--tabs-speed-font-weight`             | `var(--tabs-speed-font-weight, var(--speed-sm))`                  |
| `--tabs-speed-bg`                      | `var(--tabs-speed-bg, var(--speed-color))`                        |
| `--tabs-speed-opacity`                 | `var(--tabs-speed-opacity, var(--speed-sm))`                      |
| `--tabs-speed-left`                    | `var(--tabs-speed-left, var(--speed-sm))`                         |
| `--tabs-speed-width`                   | `var(--tabs-speed-width, var(--speed-sm))`                        |

Notes:

- Transitions use component-scoped speed variables (`--tabs-speed-*`) with fallbacks to global tokens like `--speed-sm` and `--speed-color`.

---

### Accessibility (A11y)

Components inherit behavior and ARIA attributes from Radix Tabs: keyboard navigation, correct roles, and states. Avoid removing focus styles or disabling the indicator if it harms the visibility of the active tab.

Useful: https://www.radix-ui.com/primitives/docs/components/tabs

---

### Usage notes

- If you want the tab list at the bottom, use the `reverse` prop on `Tabs`.
- `TabsList` measures the active `TabsTrigger` and updates the indicator on window/container resize.
- Use `before`/`after` on `TabsTrigger` for counts/status badges.
