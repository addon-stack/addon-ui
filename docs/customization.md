# Customizing styles

Import a component and use it with its default styles. Component imports bring their
styles automatically; you do not need to import library stylesheets separately.
Use CSS custom properties for theming and `className` or a supported slot class for
additional changes. Both methods work together.

Existing `ui.style.scss` files and theme `@include` overrides keep working. No new
plugin option, stylesheet import or application layer is required.

## Theme variables

Keep application-wide tokens in the `ui.style.scss` discovered by the
[Addon Bone plugin](../README.md#plugin-setup):

```scss
@use "addon-ui/theme" as theme;

@include theme.root {
  --font-size: 15px;
  --button-height: 36px;
  --button-border-radius: 8px;
}

@include theme.light {
  --primary-color: #123456;
}

@include theme.dark {
  --primary-color: #90b8e0;
}
```

The mixins emit your application rules without adding a library layer. `theme.root`
targets `:root` and `:host`; `theme.light` and `theme.dark` target the corresponding
theme attribute. Use the variable list in each component's documentation to choose
the relevant token, including size, color and state variants.

## A custom button

```tsx
import React from "react";

import {Button, ButtonColor} from "addon-ui";

import styles from "./checkout.scss";

export function CheckoutButton() {
    return (
        <Button color={ButtonColor.Primary} className={styles.checkout}>
            Checkout
        </Button>
    );
}
```

```scss
// checkout.scss
.checkout {
  --button-height: 42px;
  --button-padding: 0 24px;
  border-radius: 6px;
  background-color: #0f172a;

  &:hover {
    background-color: #334155;
  }
}
```

The variables customize this button's defaults. The ordinary declarations override
the library's radius and primary background, even if the component CSS loads later.
Other properties retain their library defaults. Neither `!important` nor repeated
class selectors are needed. Class order in the HTML attribute does not affect priority.

The example uses an ordinary stylesheet import. Delivery to a content-script UI
requires Addon Bone 0.13.0 or newer with automatic stylesheet routing. CSS layers do not
change that routing. See the [Shadow DOM guide](ShadowDOM.md) for container and portal setup.

## Shared and application styles

With `Workspace.Multi`, keep common rules in `src/shared` and application-specific
rules at the matching path under `src/apps/<app>`. Addon Bone's stylesheet merging
must be enabled for ordinary component styles. The UI plugin's `mergeStyles` option
separately controls composition of `ui.style.scss`; it is enabled by default.

For example, a shared component imports `./popup.scss` and passes
`styles["tabs__trigger"]` to its triggers:

```tsx
import React from "react";

import {Tabs, TabsList, TabsTrigger} from "addon-ui";

import styles from "./popup.scss";

export function OfferTabs() {
    return (
        <Tabs defaultValue="offers">
            <TabsList>
                <TabsTrigger value="offers" className={styles["tabs__trigger"]}>
                    Offers
                </TabsTrigger>
                <TabsTrigger value="coupons" className={styles["tabs__trigger"]}>
                    Coupons
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
```

```scss
// src/shared/popup.scss
.tabs {
  &__trigger {
    flex-direction: column;
    gap: 0;
    height: auto;
    padding: 0;
  }
}
```

```scss
// src/apps/shop/popup.scss
.tabs {
  &__trigger {
    z-index: 2;
    color: #0f172a;
    font-weight: 600;

    &[data-state="inactive"] {
      color: #6a6a6c;
    }
  }
}
```

Both files override library defaults. Shared rules supply the layout, and application
rules supply the colors and weight. Shared styles are composed first, so an app rule
wins over an otherwise equally ranked shared rule. Within application CSS, normal
layer, specificity and source-order rules still apply.

The same shared-first composition applies to `ui.style.scss`. With a plugin setting
such as `themeDir: "theme"`, place those files under each source directory's `theme/`.

## Cascade layers

The library declares these sublayers, from lower to higher priority for normal rules:

```css
@layer addon-ui.reset, addon-ui.tokens, addon-ui.base, addon-ui.components;
```

- `addon-ui.reset`: browser-style normalization.
- `addon-ui.tokens`: built-in theme variables.
- `addon-ui.base`: root typography and document defaults.
- `addon-ui.components`: component styles, variants and states.

Normal application declarations outside a layer outrank normal declarations inside
these layers, before selector specificity or stylesheet order is considered. This
also applies when a lazy component loads its stylesheet after your application CSS.
The `addon-ui` namespace keeps library defaults separate from your own layer names.

If your application already uses layers, declare their order in an initial stylesheet
before those layers are first used:

```scss
@layer addon-ui, application;

@layer application {
  .checkout {
    background-color: #0f172a;
  }
}
```

Later layers have higher priority for normal declarations. Include other application
layers in this initial ordering statement as needed. Layer order is fixed by first
appearance; declaring it again later does not reorder existing layers. Keep custom
rules outside the `addon-ui` namespace. You do not need to repeat its sublayer list.

## Styling boundaries

- Overrides must reach the same document or ShadowRoot and target the element that
  owns the property. Use supported slot props, such as Button's `childrenClassName`
  or TextField's `inputClassName`, for inner elements.
- A direct property declaration takes precedence over an inherited value. For example,
  a parent's `color` does not replace a component's own `color`; set its supported
  color variable or apply a class to the component instead.
- Layout constraints still combine: changing `width` does not remove `min-width`.
  Inline positioning/measurement styles and active animations/transitions also follow
  their own CSS precedence. Layers do not make every runtime declaration overridable
  with an ordinary class.
- In extension documents, the library's `body` font family and size remain unlayered
  to override Chrome's injected typography. Customize these through `--font-family`
  and `--font-size`. Ordinary direct `body` overrides follow normal specificity and
  source order for these two properties.
- ScrollArea retains one narrowly scoped `!important` declaration to replace Radix's
  inline content display. Set `--scroll-area-content-display` on the ScrollArea to
  customize it; its default is `flex`. See [ScrollArea](ScrollArea.md).

Avoid adding `!important` to application overrides: important declarations use a
different layer priority order. The examples above use ordinary declarations and
supported variables.
