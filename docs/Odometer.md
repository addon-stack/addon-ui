### Odometer

The Odometer component displays animated number transitions (based on the `odometer` library). It supports theming via CSS variables and default props via `UIProvider`/`ui.config.ts`. A low-level `useOdometer` hook is also available.

#### Import and basic usage

```tsx
import React from "react";
import {Odometer, useOdometer} from "addon-ui";

export function Example() {
    const [value, setValue] = React.useState(1234);
    React.useEffect(() => {
        const id = setInterval(() => setValue(v => v + 87), 1500);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{display: "flex", gap: 24, alignItems: "center"}}>
            {/* Component usage */}
            <Odometer value={value} format="(,ddd)" duration={1000} />

            {/* Hook usage (custom element) */}
            <CustomOdometer />
        </div>
    );
}

function CustomOdometer() {
    const ref = React.useRef<HTMLSpanElement>(null);
    // Initialize the odometer on the referenced element
    useOdometer(ref, 98765, {format: "d", duration: 500});
    return <span ref={ref} style={{fontVariantNumeric: "tabular-nums"}} />;
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop        | Type      | Default |
| ----------- | --------- | ------- |
| `value`     | `number`  | —       |
| `auto`      | `boolean` | `false` |
| `format`    | `string`  | `'d'`   |
| `duration`  | `number`  | `250`   |
| `className` | `string`  | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Hook API: useOdometer

Signature:

```txt
useOdometer(
  ref: React.RefObject<HTMLElement | null>,
  value: number,
  options?: {
    auto?: boolean;
    format?: string;
    duration?: number;
  }
): Odometer | null
```

- `ref`: Element that will host the odometer.
- `value`: Target numeric value. Changing this value triggers the odometer animation.
- `options`: Same options as the component props (except `value` and `className`). When used via the component, defaults are `auto=false`, `format='d'`, `duration=250`. When used directly via the hook, unspecified options fall back to the underlying `odometer` library defaults.
- Returns: the underlying `Odometer` instance (or `null` before initialization).

### CSS variables for Odometer

Only variables actually referenced in `src/components/Odometer/odometer.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                 | Fallback chain                                                |
| ------------------------ | ------------------------------------------------------------- |
| `--odometer-color`       | `var(--odometer-color, var(--text-primary-color))`            |
| `--odometer-font-family` | `var(--odometer-font-family, var(--font-family)), sans-serif` |
| `--speed`                | `var(--speed)` (none) – set inline from `duration` prop       |

Notes:

- The component sets `--speed` inline based on the `duration` prop: `style={{"--speed": `${duration}ms`}}`.
- Other theme tokens used in fallbacks (like `--text-primary-color`, `--font-family`) should be defined in your theme. Global timing tokens are now `--speed-*` (e.g., `--speed-sm`, `--speed-md`).

### Theming and global configuration

Provide Odometer defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        odometer: {
            // Defaults for the component when props are omitted
            auto: false,
            format: "d",
            duration: 300,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        odometer: {
            format: "(,ddd)",
            duration: 800,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- The component renders a non-interactive `<span>` with numeric content; announce context via nearby labels (e.g., “Total sales: <Odometer />”).
- If you want screen readers to announce changes as they occur, consider wrapping the value in a live region (e.g., `aria-live="polite"`).
- Ensure sufficient color contrast for the number (`--odometer-color`) against the background.
