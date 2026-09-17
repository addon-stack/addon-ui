### ScrollArea

The ScrollArea component provides a customizable scrollable container with styled scrollbars. It is built on top of Radix UI ScrollArea and supports Radix Root props in addition to library‑specific props. Theming is supported via CSS variables.

#### Import and basic usage

```tsx
import React from "react";
import {ScrollArea} from "addon-ui";

export function Example() {
    return (
        <div style={{display: "grid", gap: 16}}>
            {/* Vertical scroll */}
            <ScrollArea type="hover" scrollHideDelay={600} xOffset={3} style={{width: 300, height: 150}}>
                <div style={{padding: 10}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula, justo at congue malesuada,
                    arcu elit malesuada eros, ut tempor justo libero a est. Donec sit amet tortor nec justo auctor
                    sagittis. Fusce gravida, libero vel auctor pretium, odio risus vehicula nunc, et ultricies nunc arcu
                    a neque.
                </div>
            </ScrollArea>

            {/* Both axes (content wider than viewport) */}
            <ScrollArea type="hover" xOffset={3} yOffset={3} style={{width: 260, height: 120}}>
                <div style={{padding: 10, width: 600}}>
                    <div style={{whiteSpace: "nowrap"}}>
                        This row is intentionally very long to demonstrate horizontal scrolling inside the viewport.
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
```

#### Props

Only the prop name, type, and default are listed below.

| Prop                    | Type                                                                                  | Default |
| ----------------------- | ------------------------------------------------------------------------------------- | ------- |
| `xOffset`               | `number`                                                                              | —       |
| `yOffset`               | `number`                                                                              | —       |
| `horizontalScroll`      | `boolean`                                                                             | —       |
| `thumbClassName`        | `string`                                                                              | —       |
| `cornerClassName`       | `string`                                                                              | —       |
| `viewportClassName`     | `string`                                                                              | —       |
| `scrollbarClassName`    | `string`                                                                              | —       |
| Radix scroll area attrs | all `@radix-ui/react-scroll-area` Root props (e.g., `type`, `scrollHideDelay`, `dir`) | —       |

Note: Defaults may also be provided globally via theme/config (`UIProvider`, `ui.config.ts`). Local props take precedence over global config.

#### Radix UI props

This component wraps Radix UI ScrollArea. In addition to the props above, you can use Radix Root props. Common ones include:

- `type`: `'auto' | 'always' | 'scroll' | 'hover'`
- `scrollHideDelay`: `number`
- `dir`: `'ltr' | 'rtl'`

Full reference:
https://www.radix-ui.com/primitives/docs/components/scroll-area

### CSS variables for ScrollArea

Only variables actually referenced in `src/components/ScrollArea/scroll-area.module.scss` are listed, with their exact fallback chains. If a variable has no explicit fallback in the stylesheet, it is marked as “none (define in theme)”.

| Variable                                 | Fallback chain                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--scroll-area-content-display`         | `var(--scroll-area-content-display, flex)`                                                 |
| `--scroll-area-scrollbar-padding`        | `var(--scroll-area-scrollbar-padding, 3px)`                                                 |
| `--scroll-area-scrollbar-bg-color`       | `var(--scroll-area-scrollbar-bg-color, transparent)`                                        |
| `--scroll-area-scrollbar-bg-color-hover` | `var(--scroll-area-scrollbar-bg-color-hover, transparent)`                                  |
| `--scroll-area-scrollbar-size`           | `var(--scroll-area-scrollbar-size, 9px)`                                                    |
| `--scroll-area-scrollbar-offset`         | Vertical: `var(--scroll-area-scrollbar-offset, var(--scroll-area-scrollbar-x-offset, 2px))` |
| `--scroll-area-scrollbar-x-offset`       | `var(--scroll-area-scrollbar-x-offset, 2px)`                                                |
| `--scroll-area-scrollbar-y-offset`       | `var(--scroll-area-scrollbar-y-offset, 2px)`                                                |
| `--scroll-area-thumb-bg-color`           | `var(--scroll-area-thumb-bg-color)` (none)                                                  |
| `--scroll-area-thumb-border-radius`      | `var(--scroll-area-thumb-border-radius, 100px)`                                             |
| `--scroll-area-thumb-bg-color-hover`     | `var(--scroll-area-thumb-bg-color-hover, var(--scroll-area-thumb-bg-color))`                |

Notes:

- Horizontal scrollbar padding uses: `var(--scroll-area-scrollbar-offset, var(--scroll-area-scrollbar-y-offset, 2px))`.
- The `xOffset`/`yOffset` props also apply inline padding to the vertical/horizontal scrollbars respectively.

The measured content wrapper uses `display: var(--scroll-area-content-display, flex) !important`
to override Radix's inline `display: table`. Customize that display through the variable
on the ScrollArea root, without adding your own `!important`:

```tsx
<ScrollArea className={styles.results}>{/* Content */}</ScrollArea>
```

```scss
.results {
  --scroll-area-content-display: block;
}
```

Other class and variable overrides follow the [customization guide](customization.md).

### Theming and global configuration

You can provide ScrollArea defaults via theme/config:

```ts
// ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        scrollArea: {
            type: "hover",
            scrollHideDelay: 600,
            xOffset: 3,
            yOffset: 3,
        },
    },
});
```

Or at runtime with the provider:

```tsx
import {UIProvider} from "addon-ui";

<UIProvider
    components={{
        scrollArea: {
            type: "scroll",
            scrollHideDelay: 800,
            xOffset: 4,
            yOffset: 4,
        },
    }}
>
    {/* ... */}
</UIProvider>;
```

### Accessibility (A11y)

- ScrollArea renders a semantic container with overflow; interactive content inside remains keyboard accessible.
- Ensure focus styles are not obscured and that tab order within the viewport is logical.
- Set `dir="rtl"` when using right‑to‑left languages (can be controlled via Radix `dir` prop or higher‑level DirectionProvider).
