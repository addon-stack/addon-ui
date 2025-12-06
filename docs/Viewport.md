### Viewport

The Viewport component provides a contextual container that controls its own dimensions and exposes an API to switch between sizing modes and update target sizes. It consists of a provider component and a `useViewport` hook. Styles are themeable via CSS variables, and mode defaults can be supplied per‑usage (no global UIProvider defaults for this component).

#### Import and basic usage

```tsx
import React from "react";
import {ViewportProvider, useViewport, ViewportMode} from "addon-ui";

export function Example() {
    return (
        <ViewportProvider mode={ViewportMode.Adaptive} style={{border: "1px solid #ddd", borderRadius: 8}}>
            <Content />
        </ViewportProvider>
    );
}

function Content() {
    const {mode, setMode, setSizes, resetSizes} = useViewport();

    return (
        <div style={{display: "grid", gap: 8, padding: 12}}>
            <div style={{opacity: 0.7}}>Mode: {mode}</div>

            {/* Target min size in Adaptive mode */}
            <button onClick={() => setMode(ViewportMode.Adaptive)}>Adaptive</button>
            <button onClick={() => setSizes({width: 360, height: 420})}>Set min size 360×420</button>

            {/* Fixed locks width/height to exact size */}
            <button onClick={() => setMode(ViewportMode.Fixed)}>Fixed</button>
            <button onClick={() => setSizes({width: 420, height: 320})}>Lock 420×320</button>

            {/* Expanded stretches to max limits */}
            <button onClick={() => setMode(ViewportMode.Expanded)}>Expanded</button>

            <button onClick={resetSizes}>Reset sizes</button>

            <div style={{background: "var(--bg-secondary-color)", padding: 12, borderRadius: 6}}>
                Your content lives here and will be sized according to the current mode.
            </div>
        </div>
    );
}
```

#### Props (ViewportProvider)

Only the prop name, type, and default are listed below.

| Prop     | Type                                          | Default      |
| -------- | --------------------------------------------- | ------------ |
| `mode`   | `'fixed' \| 'adaptive' \| 'expanded'`         | `'adaptive'` |
| HTML div | all standard `div` attributes (e.g., `style`) | —            |

Note: This provider controls its container element size. Use the `useViewport` hook inside to adjust the sizing behavior programmatically.

#### Enums

```ts
ViewportMode.Fixed;
ViewportMode.Adaptive;
ViewportMode.Expanded;
```

#### Hook API: useViewport

Signature:

```txt
useViewport(): {
  mode: ViewportMode;
  setMode(mode: ViewportMode): void;
  setSizes(sizes: { width?: number | string; height?: number | string }): void;
  resetSizes(): void;
}
```

- `mode`: Current sizing mode.
- `setMode(mode)`: Switch between `Fixed`, `Adaptive`, and `Expanded`.
- `setSizes({width, height})`: Provide target dimensions.
    - In `Fixed` mode, width/height are applied as exact size (also set as min/max to lock).
    - In `Adaptive` mode, width/height are applied as minimums (`min-width`/`min-height`).
- `resetSizes()`: Clears provided sizes; the provider will rely on its CSS variables or content.

### CSS variables for Viewport

Only variables actually referenced in `src/components/Viewport/viewport.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                      | Fallback chain                                      |
| ----------------------------- | --------------------------------------------------- |
| `--viewport-min-width`        | `var(--viewport-min-width)` (none)                  |
| `--viewport-max-width`        | `var(--viewport-max-width)` (none)                  |
| `--viewport-min-height`       | `var(--viewport-min-height)` (none)                 |
| `--viewport-max-height`       | `var(--viewport-max-height)` (none)                 |
| `--viewport-width`            | `var(--viewport-width)` (none)                      |
| `--viewport-height`           | `var(--viewport-height)` (none)                     |
| `--viewport-speed-height`     | `var(--viewport-speed-height, var(--speed-md))`     |
| `--viewport-speed-width`      | `var(--viewport-speed-width, var(--speed-md))`      |
| `--viewport-speed-min-height` | `var(--viewport-speed-min-height, var(--speed-md))` |
| `--viewport-speed-min-width`  | `var(--viewport-speed-min-width, var(--speed-md))`  |
| `--viewport-speed-max-height` | `var(--viewport-speed-max-height, var(--speed-md))` |
| `--viewport-speed-max-width`  | `var(--viewport-speed-max-width, var(--speed-md))`  |

Notes:

- In the `--expanded` modifier, the container sets `min-width` to `--viewport-max-width` and `min-height` to `--viewport-max-height`.
- In the `--fixed` modifier, the container sets `width`/`height` and their corresponding min/max to `--viewport-width`/`--viewport-height`.
- Size transition durations use component-scoped `--viewport-speed-*` variables with fallbacks to the global `--speed-md`.

### Accessibility (A11y)

- ViewportProvider renders a semantic `<div>`; it does not alter focus management. Ensure interactive content inside remains keyboard accessible.
- When constraining sizes (especially in `Fixed` mode), verify that content remains usable across devices and zoom levels.
- Prefer using `Adaptive` with reasonable `min` sizes to accommodate responsive layouts and large font settings.
