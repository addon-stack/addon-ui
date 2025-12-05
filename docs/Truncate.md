### Truncate

Single-line text truncation component. Supports classic end truncation via CSS and smart middle truncation that keeps the beginning and the end of the string.

#### Import and basic usage

```tsx
import {Truncate} from "addon-ui";

export function Example() {
    return (
        <div style={{width: 220}}>
            {/* Classic end truncation */}
            <Truncate text="/very/long/path/to/some/important/file.txt" />

            {/* Middle truncation with default separator ... */}
            <Truncate text="john.doe.really.long@example-domain.com" middle />

            {/* Middle truncation with custom separator */}
            <Truncate text="0x5fC2e1A9B2C3D4E5F6A7B8C9D0abcdef12345678" middle separator=" ··· " />
        </div>
    );
}
```

---

#### Props

Only the prop name, type, and default are listed below.

| Prop            | Type                           | Default |
| --------------- | ------------------------------ | ------- |
| `text`          | `string`                       | `""`    |
| `middle`        | `boolean`                      | —       |
| `separator`     | `string`                       | `"..."` |
| HTML span attrs | all standard `span` attributes | —       |

Notes:

- Supports contextual defaults via the UI provider: `useComponentProps("truncate")`.
- When `middle` is off, the component renders the original `text` and relies on CSS `text-overflow: ellipsis`.
- When `middle` is on, it measures available width and computes a middle-trimmed string using a binary search.

---

### CSS variables for Truncate

Only variables actually referenced in `src/components/Truncate/truncate.module.scss` are listed, with their exact fallback chains.

| Variable                  | Fallback chain                      |
| ------------------------- | ----------------------------------- |
| `--truncate-around-space` | `var(--truncate-around-space, 8px)` |

Notes:

- `--truncate-around-space` adds right (or left in RTL) inner padding when `middle` is enabled to ensure the separator remains visible.

---

### Accessibility (A11y)

- Truncated strings may hide important information. Consider adding a `title` attribute or a `Tooltip` with the full value.
- Ensure sufficient contrast so the separator (e.g., `...`) is clearly visible.
- The component renders a non-interactive `span`. If interaction is needed, wrap it in an appropriate control.

---

### Usage notes

- Middle truncation reacts to container size changes via `ResizeObserver` and window `resize` events. Ensure the element has a constrained width (e.g., via parent layout) for correct measurement.
- If the surrounding layout frequently changes size, the component debounces work using `requestAnimationFrame` to avoid excessive reflows.
- For RTL layouts, internal padding flips automatically so the separator remains visible near the center.
