### Icon

`Icon` resolves a name through the UI configuration and renders it using a sprite,
an inline SVG component, or an image URL. Existing component-only entries keep
using the sprite.

#### Configuration

```tsx
import {IconMode} from "addon-ui";
import {defineConfig} from "addon-ui/config";

import Offers from "./icons/offers.svg?react";
import Logo from "./icons/logo.svg?react";
import Animated from "./icons/animated.svg?react";
import statusUrl from "./icons/status.svg";

export default defineConfig({
    icons: {
        offers: Offers,
        logo: {
            mode: IconMode.Sprite,
            component: Logo,
            viewBox: "0 0 120 40",
        },
        animated: {mode: "inline", component: Animated},
        status: {mode: IconMode.Asset, src: statusUrl},
    },
});
```

`IconMode` and icon definition types are exported from `addon-ui`. Each mode also
accepts its string literal: `"sprite"`, `"inline"`, or `"asset"`. Descriptors require
an explicit mode. TypeScript rejects `src` in sprite/inline entries and `component`
in asset entries, including when an entry comes from a variable.

- **Sprite:** a component or `{mode: "sprite", component, viewBox?}`. The provider
  registers a symbol when the name is first used. Repeated instances reference
  that symbol through `<use>`. The default symbol viewBox is `0 0 24 24`.
- **Inline:** `{mode: "inline", component, viewBox?}`. Each instance mounts its own
  component inside the outer SVG; it is never registered in the sprite. SVG files
  can still be imported with `?react`. A full SVG component should forward its
  SVG props so it receives `width="100%"`, `height="100%"` and explicit viewBox
  overrides. Without an override, its own viewBox is preserved.
- **Asset:** `{mode: "asset", src}`. The outer SVG contains an `<image>` referencing
  the supplied URL. No sprite symbol is registered. Use an ordinary asset import,
  or `getUrl("icons/status.svg")` from `@addon-core/browser` for a known packaged path.
  An import lets the bundler emit and resolve the asset; `getUrl()` only constructs
  its extension URL, so the file must already be packaged and exposed through WAR
  where required. In AddonBone 0.13, `?browser` and `?chrome` produce a CSS-localization
  token (`__MSG_@@extension_id__`); it is not substituted in JavaScript URLs.
  Do not pass those imports to `src`. The library does not fetch or inline the file.

#### Usage and dimensions

```tsx
import React from "react";
import {Icon, UIProvider} from "addon-ui";

export function Example() {
    return (
        <UIProvider>
            <Icon name="offers" size={28} aria-hidden="true" />
            <Icon name="logo" width={120} height={40} aria-label="Brand" role="img" />
            <Icon name="animated" className="animated-icon" />
            <Icon name="status" size={32} aria-label="Status" role="img" />
        </UIProvider>
    );
}
```

The provider owns the sprite; do not mount an additional `SvgSprite` for these icons.

- `name` selects the configured icon.
- `size` defaults to `24`; `width` and `height` independently default to `size`.
- `viewBox` on `Icon` overrides the outer viewport for that instance. It does not
  rewrite the shared sprite symbol. For sprite descriptors, configure the source
  coordinate system in the entry's `viewBox`; width/height control display size.
- Standard SVG props, callbacks, `className`, `style` and `preserveAspectRatio`
  apply to the outer SVG. All three modes retain a `SVGSVGElement` ref.
- Asset images fill the SVG viewport and preserve their aspect ratio by default;
  `preserveAspectRatio="none"` explicitly permits stretching.
- Unknown names retain the existing `⁇` span fallback and console warning. Caller
  styles override fallback dimensions; this fallback has no SVG ref.

#### Props

| Prop | Type | Default |
| --- | --- | --- |
| `name` | `string` | Required |
| `size` | `number` | `24` |
| `width`, `height` | `number` or `string` | `size` |
| `viewBox` | `string` | Definition's `viewBox`, otherwise omitted |
| `preserveAspectRatio` | `string` | Browser SVG default |
| SVG attributes, callbacks, `className`, `style` | Standard SVG props | — |
| `ref` | `Ref<SVGSVGElement>` | — |

#### SVG files and coordinate systems

For SVG files with fixed `width` and `height`, an explicit descriptor `viewBox`
is required for predictable scaling. AddonBone 0.13's SVGR loader places props
before file attributes, so fixed file dimensions override the library's `100%`
props. SVGO can also remove a `viewBox` matching those dimensions. This affects
both sprite and inline modes; the library does not inspect or rewrite SVG components.

For an exported file with `width="80" height="20" viewBox="0 0 80 20"`, use:

```tsx
export default defineConfig({
    icons: {
        logo: {mode: "sprite", component: Logo, viewBox: "0 0 80 20"},
        animatedLogo: {mode: "inline", component: Logo, viewBox: "0 0 80 20"},
    },
});
```

Render either name with `size={40} height={10}` to scale to half the source dimensions.

Without explicit metadata, fixed-size sprite sources can be clipped by the
symbol's default `0 0 24 24` viewport, and inline sources retain their fixed size
inside the outer Icon. Files containing only a `viewBox` retain it through the
loader. The library forwards a source `viewBox` override only when explicitly
specified; it never replaces it with the symbol's default.

SVG attributes explicitly written after a component's props still take precedence.
Loader-level normalization such as SVGR `dimensions: false` is a separate
AddonBone follow-up; it is not enabled by addon-ui.

#### Shared configuration and provider overrides

Icon maps combine by name: later definitions replace the **entire** entry.
Shared icons absent from the app remain available. Replacing a sprite with an
asset removes its old component and viewBox; even same-mode overrides are whole
entries. Passing `UIProvider.icons` applies the same rule over the generated
configuration. Component defaults and extra configuration retain their existing
deep merge and array merge behavior.

```tsx
<UIProvider icons={{status: {mode: "asset", src: anotherStatusUrl}}}>
    <Icon name="status" />
</UIProvider>
```

Changing a name's mode while mounted updates its renderer. Only sprite entries
are included in the provider's sprite; switching to inline or asset removes the
previous symbol for that name.

#### Styling, animation and limitations

Application classes can override the library's layered defaults. CSS variables
remain the primary theming API:

| Variable | Fallback chain |
| --- | --- |
| `--icon-color` | `var(--icon-color)` — none; define in theme |
| `--icon-color-hover` | `var(--icon-color-hover)` — none; define in theme |
| `--icon-scale` | `var(--icon-scale, 1)` |
| `--icon-speed-transform` | `var(--icon-speed-transform, var(--speed-sm))` |
| `--icon-speed-color` | `var(--icon-speed-color, var(--speed-color))` |

Sprite content can inherit `currentColor`, custom properties and stroke values
from its visible instance. A hard-coded value on a path takes precedence over
inheritance. Animation does not itself require inline mode. Stroke reveal needs
both a dash pattern and an animated dash offset; matching `pathLength="100"`
with dasharray `100 100` and offset `100` to `0` normalizes drawing duration.

Inline mode allows selectors such as `.animated-icon path` and per-instance React
state. It does not disable SVG optimization: the loader may still merge paths.
The library does not rewrite internal gradient/mask IDs. AddonBone's default SVGR
loader prefixes file IDs, but handwritten components and repeated instances
still need care. Repeated inline SVGs requiring independent definitions must supply unique IDs and matching references, for example
inside a component using `useId` on supported React versions.

Asset SVGs render in image context. They do not inherit the application's CSS
variables or `currentColor`, and application selectors cannot reach their internal
paths. Self-contained declarative animation can run; JavaScript-based interaction
inside the SVG is unavailable. Use inline mode when application code must control
individual elements.

In Shadow DOM, place the provider and its sprite consumers in the same ShadowRoot,
including portal contents. Independent roots can use the same configured names.
Provider nesting within one DOM tree does not namespace symbol IDs; avoid conflicting
sprite names in that tree.

Provide `aria-label` and `role="img"` for meaningful icons, or `aria-hidden="true"`
for decoration. Give surrounding controls their own accessible labels.
