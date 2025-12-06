### TruncateList

Responsive list that automatically collapses overflowing items and shows a +N counter. By default, the counter is rendered with the Tag component.

Built on top of `react-responsive-overflow-list`.

#### Import and basic usage

```tsx
import React from "react";
import {TruncateList, Tag, Tooltip} from "addon-ui";

type User = {id: string; name: string};

const users: User[] = [
    {id: "1", name: "Alice"},
    {id: "2", name: "Bob"},
    {id: "3", name: "Charlie"},
    {id: "4", name: "Diana"},
    {id: "5", name: "Eve"},
    {id: "6", name: "Frank"},
];

export function Example() {
    return (
        <div style={{width: 260}}>
            {/* Default counter: <Tag>+N</Tag> */}
            <TruncateList
                items={users}
                collapseFrom="end"
                visibleItemCount={Infinity}
                itemRenderer={u => <Tag key={u.id}>{u.name}</Tag>}
            />

            {/* Custom overflow renderer with tooltip */}
            <TruncateList
                items={users}
                collapseFrom="end"
                visibleItemCount={Infinity}
                itemRenderer={u => <Tag key={u.id}>{u.name}</Tag>}
                renderOverflow={hidden => (
                    <Tooltip content={hidden.map(u => u.name).join(", ")}>
                        <Tag>{`+${hidden.length}`}</Tag>
                    </Tooltip>
                )}
            />
        </div>
    );
}
```

---

#### Props

Only the prop name, type, and default are listed below.

| Prop               | Type                                    | Default |
| ------------------ | --------------------------------------- | ------- |
| `counterClassName` | `string`                                | —       |
| `renderOverflow`   | `(hiddenItems: T[]) => React.ReactNode` | —       |
| OverflowList props | all `OverflowListProps<T>`              | —       |

Notes:

- If `renderOverflow` is not provided, the component renders `<Tag className="truncate-list__counter">+N</Tag>` by default.
- Supports contextual defaults via the UI provider: `useComponentProps("truncateList")`.
- The base props are inherited from `react-responsive-overflow-list` (e.g., `items`, `itemRenderer`, `visibleItemCount`, `collapseFrom`, etc.). See the package docs for the full API: https://www.npmjs.com/package/react-responsive-overflow-list

---

### CSS variables for TruncateList

Only variables actually referenced in `src/components/TruncateList/truncate-list.module.scss` are listed, with their exact fallback chains.

| Variable                            | Fallback chain                                                     |
| ----------------------------------- | ------------------------------------------------------------------ |
| `--truncate-list-gap`               | `var(--truncate-list-gap, 8px)`                                    |
| `--truncate-list-counter-br-radius` | `var(--truncate-list-counter-br-radius, 9999px)`                   |
| `--truncate-list-counter-bg-color`  | `var(--truncate-list-counter-bg-color, var(--bg-secondary-color))` |
| `--truncate-list-counter-padding`   | `var(--truncate-list-counter-padding, 0px 4px)`                    |
| `--truncate-list-counter-color`     | `var(--truncate-list-counter-color, var(--text-secondary-color))`  |
| `--truncate-list-counter-font-size` | `var(--truncate-list-counter-font-size, inherit)`                  |
| `--truncate-list-speed-color`       | `var(--truncate-list-speed-color, var(--speed-color))`             |
| `--truncate-list-speed-bg`          | `var(--truncate-list-speed-bg, var(--speed-color))`                |

Notes:

- RTL support: in right-to-left layouts, the list direction is reversed so that collapsing and counter placement remain intuitive.

---

### Accessibility (A11y)

- Ensure each rendered item has clear text or an accessible label.
- Provide an accessible label for the counter (e.g., `aria-label="3 more"`), especially if the visual `+N` alone may not be descriptive.
- If items are interactive (buttons/links), ensure they remain keyboard-accessible after truncation.

---

### Usage notes

- Spacing between items is controlled by `--truncate-list-gap`.
- Use `visibleItemCount={Infinity}` to let the component determine how many items can fit based on available width.
- `collapseFrom` can be used to collapse items from the `start` or the `end` of the list (depending on library behavior).
- The default counter uses the Tag component; customize via `counterClassName` or provide a `renderOverflow` implementation.
