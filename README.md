# addon-ui

A React UI toolkit for Addon Bone browser-extension applications.

[![npm version](https://img.shields.io/npm/v/addon-ui.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/addon-ui)
[![npm downloads](https://img.shields.io/npm/dm/addon-ui.svg?style=for-the-badge&color=blue)](https://www.npmjs.com/package/addon-ui)
[![CI](https://img.shields.io/github/actions/workflow/status/addon-stack/addon-ui/ci.yml?branch=develop&style=for-the-badge)](https://github.com/addon-stack/addon-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE.md)

Build consistent browser-extension interfaces with React components, typed UI
configuration, theme customization, and an Addon Bone plugin for shared and
app-specific UI files.

## Why addon-ui

- 🎨 **Customizable Theming**: Easily customize the look and feel of components through theme configuration
- 🧩 **Rich Component Set**: Includes buttons, forms, layouts, modals, and more
- 🔌 **Addon Bone Integration**: Seamless integration with the Addon Bone framework
- 📚 **Storybook Documentation**: Comprehensive component documentation with examples
- 🛠️ **TypeScript Support**: Full TypeScript support with type definitions

## Table of Contents

- [Why addon-ui](#why-addon-ui)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Package Entry Points](#package-entry-points)
- [Components](#components)
- [Integration](#integration)
- [Customization](#customization)
- [Using Extra Props](#using-extra-props)
- [Theming and style reuse](#theming-and-style-reuse)
- [Radix UI and third-party integrations](#radix-ui-and-third-party-integrations)
- [Icons and sprite](#icons-and-sprite)
- [Extra props](#extra-props-cross-cutting-configuration)
- [Contributing](#contributing)

## Installation

`addon-ui` is designed to be used with [Addon Bone](https://addonbone.com). Your host application must provide
compatible `adnbn`, `react`, and `react-dom` peer dependencies.

```bash
npm i addon-ui
```

With pnpm or Yarn:

```bash
pnpm add addon-ui
yarn add addon-ui
```

## Quick Start

```jsx
import React from "react";
import {Button, ButtonColor, ButtonVariant, TextField, UIProvider} from "addon-ui";

function App() {
    return (
        <UIProvider>
            <div>
                <TextField label="Username" placeholder="Enter your username" />
                <Button color={ButtonColor.Primary} variant={ButtonVariant.Contained}>
                    Submit
                </Button>
            </div>
        </UIProvider>
    );
}

export default App;
```

## Package Entry Points

| Import            | Use it for                                                    |
| :---------------- | :------------------------------------------------------------ |
| `addon-ui`        | React components, UI providers, and theme types.              |
| `addon-ui/config` | The typed `defineConfig()` helper for UI configuration files. |
| `addon-ui/plugin` | Addon Bone plugin setup and UI-file discovery.                |
| `addon-ui/theme`  | Sass mixins for extending theme styles.                       |

See [Plugin Setup](#plugin-setup) to connect the package to an Addon Bone application.

## Components

This library now ships with dedicated documentation files for each component in the docs/ directory. Start here:

- [Accordion](docs/Accordion.md)
- [Avatar](docs/Avatar.md)
- [Button](docs/Button.md)
- [Checkbox](docs/Checkbox.md)
- [Dialog](docs/Dialog.md)
- [Drawer](docs/Drawer.md)
- [Footer](docs/Footer.md)
- [Header](docs/Header.md)
- [Highlight](docs/Highlight.md)
- [Icon](docs/Icon.md)
- [IconButton](docs/IconButton.md)
- [List](docs/List.md) (covers List and ListItem)
- [Modal](docs/Modal.md)
- [Odometer](docs/Odometer.md) (component + `useOdometer` hook)
- [Popover](docs/Popover.md)
- [ScrollArea](docs/ScrollArea.md)
- [Select](docs/Select.md)
- [Shift](docs/Shift.md)
- [SvgSprite](docs/SvgSprite.md)
- [Switch](docs/Switch.md)
- [Tabs](docs/Tabs.md) (includes `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`)
- [Tag](docs/Tag.md)
- [TextArea](docs/TextArea.md)
- [TextField](docs/TextField.md)
- [Toast](docs/Toast.md)
- [ToggleGroup](docs/ToggleGroup.md)
- [Tooltip](docs/Tooltip.md)
- [Truncate](docs/Truncate.md)
- [TruncateList](docs/TruncateList.md)
- [View](docs/View.md)
- [ViewDrawer](docs/ViewDrawer.md)
- [ViewModal](docs/ViewModal.md)
- [Viewport](docs/Viewport.md) (`ViewportProvider` + `useViewport`)

Notes:

- Each CSS variables table lists only component-scoped variables with exact fallback chains from the corresponding \*
  .module.scss file.
- Where a component wraps a Radix UI primitive, the doc links to the official Radix docs and lists common props.

## Integration

**Addon UI** is designed exclusively for the [Addon Bone](https://addonbone.com) framework and does not have a standalone build as it's connected
as a plugin. This library is an integral part of the Addon Bone ecosystem for developing browser extensions with a
shared codebase.

[Addon Bone](https://addonbone.com) is a framework for developing browser extensions with a common codebase. This means you can create multiple
extensions with the same functionality but with different designs, localizations, and feature sets depending on the
needs of each extension while maintaining access to a shared codebase.

### Plugin Setup

```ts
// adnbn.config.ts
import {defineConfig} from "adnbn";
import ui from "addon-ui/plugin";

export default defineConfig({
    plugins: [
        ui({
            themeDir: "./theme", // Directory for theme files
            configName: "ui.config", // Name of config files
            styleName: "ui.style", // Name of style files
            mergeConfig: true, // Merge configs from different directories
            mergeStyles: true, // Merge styles from different directories
        }),
    ],
});
```

### Plugin Options

| Option        | Type      | Default       | Description                                                            |
| :------------ | :-------- | :------------ | :--------------------------------------------------------------------- |
| `themeDir`    | `string`  | `"."`         | Directory path where plugin configuration and style files are located. |
| `configName`  | `string`  | `"ui.config"` | Name of the configuration file.                                        |
| `styleName`   | `string`  | `"ui.style"`  | Name of the SCSS style file.                                           |
| `mergeConfig` | `boolean` | `true`        | Whether to merge configuration files from different directories.       |
| `mergeStyles` | `boolean` | `true`        | Whether to merge style files from different directories.               |

Names without a supported extension (such as `ui.config` or `ui.style`) use extension
priority: `.tsx` before `.ts`, and `.scss` before `.css`. An explicit supported extension
selects that exact file; a missing `.ts` or `.css` file is not replaced by another extension.

The plugin requires AddonBone 0.13.0 or newer. It generates the internal modules
`#addon-ui/config` and `#addon-ui/style.scss` using the current Rspack compiler.
During development it watches configuration/style files and their search directories,
including directories that do not exist yet. Creating, editing or deleting these files
updates the next build. Invalid TypeScript or SCSS produces a build error; correcting
it allows watch mode to recover.

Shared files are composed before application files. With `mergeConfig: false` or
`mergeStyles: false`, only the highest-priority matching file is used. SCSS is parsed
as a syntax tree. Leading `@use`/`@forward` directives and their configuration variables
are composed before the shared and application bodies, followed by leading CSS imports
and layer declarations. Multiline directives and comments remain intact. Both bodies
share one Sass scope; this does not turn each source into an independent Sass module.
Application prelude variables therefore also affect the shared body. Keep body-specific
values in separate variables or explicitly configured modules.

Only identical, unconfigured module directives repeated across sources are deduplicated.
Variables, CSS rules and configured loads are retained; incompatible namespaces or module
configurations produce Sass errors. A late `@use` or `@forward` in an original source
produces an error with its filename and location instead of being silently moved.

Local `@use`, `@forward`, `@import` and literal relative `url(...)` paths are resolved
from their source file. Nested Sass partials retain their own resource base through
Sass source maps and `resolve-url-loader`, applied only to the generated stylesheet.
Built-in Sass modules, package imports and external/root-relative URLs keep their normal
resolution. Watch builds track imported partials and assets through the loaders.
Application theme rules remain outside the library's cascade layers unless you explicitly
put them in a layer. Stylesheets use ordinary imports; CSS extraction and delivery remain
owned by AddonBone 0.13.0 or newer, which automatically routes ordinary stylesheet
imports to the appropriate document or ShadowRoot. See the
[customization guide](docs/customization.md) for CSS precedence and application layer ordering.

Without `ui()`, the package resolves these internal imports to a configuration with
empty `components`, `extra` and `icons`, and an empty override stylesheet. Storybook
and other compatible bundlers therefore need no aliases for these modules. They still
need the normal TypeScript, React and SCSS support required by addon-ui. Private
`#addon-ui/...` imports and the Rspack implementation are not public package APIs.

### Configuration Files

The `addon-ui` configuration is designed to retrieve configuration from each extension separately, allowing for
different designs for different extensions without changing any code. You only need to modify the configuration, style
variables, and icons.

The plugin looks for configuration files in specific directories within your project. By default, it searches in the
following locations (in order of priority):

1. **App-specific directory**: `src/apps/[app-name]/[app-src-dir]/[theme-dir]`
2. **Shared directory**: `src/shared/[theme-dir]`

Where `[theme-dir]` is the directory specified in the `themeDir` option (defaults to the current directory).

The `mergeConfig` option (default: `true`) determines whether configurations from multiple directories should be merged.
When enabled, configurations from both app-specific and shared directories will be combined, with app-specific values
taking precedence in case of conflicts. If disabled, only the first configuration found will be used (with app-specific
having priority).

You can create these files to customize the UI components:

#### ui.config.ts

You can use the `defineConfig` helper which provides type checking:

```ts
// src/shared/theme/ui.config.ts
import {defineConfig} from "addon-ui/config";
import {ButtonColor, ButtonRadius, ButtonVariant, TextFieldRadius, TextFieldSize} from "addon-ui";

import CloseIcon from "./icons/close.svg?react";

export default defineConfig({
    components: {
        button: {
            variant: ButtonVariant.Contained,
            color: ButtonColor.Primary,
            radius: ButtonRadius.Medium,
        },
        textField: {
            size: TextFieldSize.Medium,
            radius: TextFieldRadius.Small,
        },
        // ... other component configurations
    },
    icons: {
        close: CloseIcon,
        // Other custom icons
    },
});
```

The example above shows how to use the TypeScript configuration with the Addon Bone framework.
The `defineConfig` helper provides type checking and autocompletion for your configuration.
Import component enum values from "addon-ui" and `defineConfig` from "addon-ui/config".
The configuration can also include SVG icons imported directly from your project files.

#### ui.style.scss

Similar to configuration files, style files are also searched for in the same directories with the same priority order.
The `mergeStyles` option (default: `true`) works the same way as `mergeConfig`, allowing styles from multiple
directories to be combined when enabled.

```scss
// src/shared/theme/ui.style.scss
// Custom CSS variables and mixins for theming
@import "addon-ui/theme";

@include light {
    // Base colors
    --primary-color: #3f51b5;
    --secondary-color: #f50057;
    --accent-color: #4caf50;

    // Text colors
    --text-primary-color: #212121;
    --text-secondary-color: #757575;

    // Background colors
    --bg-primary-color: #ffffff;
    --bg-secondary-color: #f5f5f5;

    // Font settings
    --font-family: "Roboto", sans-serif;
    --font-size: 14px;
    --line-height: 1.5;

    // Button specific variables
    --button-font-family: var(--font-family);
    --button-font-size: var(--font-size);
    --button-height: 34px;
    --button-border-radius: 10px;

    // Button size variants
    --button-height-sm: 24px;
    --button-height-md: 44px;
    --button-height-lg: 54px;

    // Button radius variants
    --button-border-radius-sm: 5px;
    --button-border-radius-md: 12px;
    --button-border-radius-lg: 15px;
}

@include dark {
    // Base colors for dark theme
    --primary-color: #7986cb;
    --secondary-color: #ff4081;
    --accent-color: #66bb6a;

    // Text colors for dark theme
    --text-primary-color: #ffffff;
    --text-secondary-color: #b0bec5;

    // Background colors for dark theme
    --bg-primary-color: #121212;
    --bg-secondary-color: #1e1e1e;
}
```

## Customization

Components include their default styles automatically. CSS variables in `ui.style.scss`
are the primary theming API; use `className` and supported slot classes for additional changes.
Existing theme mixins and `@include` overrides continue to work without changes.

Library styles use the `addon-ui.reset`, `addon-ui.tokens`, `addon-ui.base` and
`addon-ui.components` cascade layers. Normal application rules outside layers override
component defaults, including variants and states, even when library CSS loads later.
Applications with their own layers should declare an initial order such as
`@layer addon-ui, application;`.

See [Customizing styles](docs/customization.md) for complete Button and shared/app
Tabs examples, layer ordering, slot targeting, and the document typography and
ScrollArea exceptions.

### Global Theme Customization

You can customize the theme globally by passing props to the `UIProvider`:

```jsx
import {UIProvider} from "addon-ui";

const customTheme = {
    components: {
        button: {
            variant: "outlined",
            color: "primary",
        },
        textField: {
            radius: "medium",
        },
    },
    icons: {
        // Custom icons
    },
    // Specify the DOM element to set theme/view/browser attributes on
    container: "#app-root",
};

function App() {
    return <UIProvider {...customTheme}>{/* Your application */}</UIProvider>;
}
```

For content scripts mounted in a ShadowRoot, pass its host as `container` and the ShadowRoot as `portal`. CSS delivery requires AddonBone isolated style routing. See the [Shadow DOM integration guide](./docs/ShadowDOM.md) and [automated test suites](./tests/README.md).

### UIProvider Props

| Prop         | Type                                  | Default     | Description                                                    |
| :----------- | :------------------------------------ | :---------- | :------------------------------------------------------------- |
| `components` | `ComponentsProps`                     | `{}`        | Component-specific configuration overrides.                    |
| `icons`      | `IconMap`                               | `{}`        | Custom SVG icons registration.                                 |
| `extra`      | `ExtraProps`                          | `{}`        | App-wide extra properties.                                     |
| `storage`    | `ThemeStorageContract \| true`        | `undefined` | Persistence storage for theme settings.                        |
| `container`  | `string \| Element \| false`          | `"html"`    | Target element for attributes. Set to `false` to disable.      |
| `portal`     | `Element \| DocumentFragment \| null` | `undefined` | Default target for floating layers; `null` waits for a target. |
| `view`       | `string`                              | `undefined` | Custom view identifier for specific styling.                   |

### Using Extra Props

Extra Props is a powerful feature that allows you to extend component props with custom properties. This is particularly
useful when you need to add custom functionality or data to components across your application without modifying the
original component code.

#### What are Extra Props?

Extra Props provide a way to pass additional properties to components throughout your application using React Context.
This allows you to:

- Add application-specific properties to UI components
- Share common data across multiple components
- Extend the library's components with your own custom properties

#### How to Use Extra Props

1. **Configure Extra Props in your theme configuration:**

```ts
// src/shared/theme/ui.config.ts
import {defineConfig} from "addon-ui/config";

export default defineConfig({
    components: {
        // Component configurations
    },
    extra: {
        // Your custom properties
        appName: "My Awesome App",
        version: "1.0.0",
        features: {
            darkMode: true,
            analytics: false,
        },
    },
    icons: {
        // Icon configurations
    },
});
```

2. **Access Extra Props in your components using the `useExtra` hook:**

```jsx
import {useExtra} from "addon-ui";

function AppHeader() {
    const extra = useExtra();

    return (
        <header>
            <h1>{extra.appName}</h1>
            <span>Version: {extra.version}</span>
        </header>
    );
}
```

#### Example Use Case

A common use case for Extra Props is to add application-specific configuration to UI components. For example, you might
want to add custom analytics tracking to buttons:

```jsx
import {Button, useExtra} from "addon-ui";

function TrackableButton(props) {
    const extra = useExtra();

    const handleClick = e => {
        // Use extra props for analytics
        if (extra.features.analytics) {
            trackButtonClick(props.trackingId);
        }

        // Call the original onClick handler
        props.onClick?.(e);
    };

    return <Button {...props} onClick={handleClick} />;
}
```

#### Extending ExtraProps in TypeScript

To get proper type checking for your custom Extra Props, you can extend the `ExtraProps` interface:

```ts
// ui.d.ts or similar file
import "addon-ui";

declare module "addon-ui" {
    interface ExtraProps {
        appName: string;
        version: string;
        features: {
            darkMode: boolean;
            analytics: boolean;
        };
        // Add any other custom properties
    }
}
```

With this type definition, TypeScript will provide proper type checking and autocompletion when using the `useExtra`
hook:

```tsx
import React from "react";
import {useExtra, Button} from "addon-ui";

const FeatureFlag: React.FC<{feature: keyof ExtraProps["features"]; children: React.ReactNode}> = ({
    feature,
    children,
}) => {
    const extra = useExtra();

    // TypeScript knows that extra.features exists and has the properties we defined
    if (extra.features[feature]) {
        return <>{children}</>;
    }

    return null;
};

// Usage
function App() {
    return (
        <div>
            <FeatureFlag feature="darkMode">
                <Button>Dark Mode Enabled</Button>
            </FeatureFlag>
        </div>
    );
}
```

---

## Theming and style reuse

- Global theme tokens (colors, typography, spacing, transitions) live in your `ui.style.scss`.
- Each component also exposes its own `--component-*` variables. See the CSS variables tables in the docs to know exactly what you can override.
- **Theme Mixins**: Use `@import "addon-ui/theme";` to access `@include light { ... }` and `@include dark { ... }` mixins.
- **Universal Targeting**: These mixins are container-agnostic. They work correctly whether the `theme` attribute is on a parent element, the component itself, or the shadow host.
- **Context-Aware**:
    - When used at the top level, they generate global selectors: `[theme="dark"] { ... }`.
    - When used inside a component, they generate scoped selectors: `[theme="dark"] .my-comp, .my-comp[theme="dark"] { ... }`.

## Radix UI and third-party integrations

Several components are built on Radix primitives (Dialog, Checkbox, ScrollArea, Switch, Toast) or wrap third-party
tools (react-highlight-words, odometer). Each doc links to the official API and explains which props you can pass
through.

## Icons and sprite

- Register icons in `ui.config.ts` or via `UIProvider`’s `icons` prop. The Icon component pulls symbols from the
  automatically mounted SvgSprite in sprite mode; inline and asset entries render directly.
- Icons are lazily registered: a symbol is added only after an Icon with that name renders at least once.
- See docs/Icon.md and docs/SvgSprite.md for details and examples.

### Icon sources

Icon configuration supports component shorthand (sprite), `IconMode.Sprite`,
`IconMode.Inline` and `IconMode.Asset`, plus their string literals. SVG modes take
`component`; asset mode takes `src`. The fields are mutually exclusive in TypeScript.
Shared/app and provider overrides replace each same-name icon entry in full.
`<Icon name="..." />` and its SVG ref stay unchanged across modes.
Provider-owned symbol IDs are namespaced per provider; use Icon rather than constructing
raw `#name` references. Standalone SvgSprite preserves raw names for manual `<use>` links.
See [Icon configuration and examples](./docs/Icon.md).

## Extra props (cross-cutting configuration)

Use the `extra` field in `ui.config.ts` to supply app-wide values (feature flags, labels, analytics switches) and access
them at runtime with the `useExtra()` hook. You can augment the `ExtraProps` TypeScript interface by declaration merging
for full type safety.

## Contributing

- See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch, commit, and release policy.
- Keep canonical end-user documentation in the `docs/` directory. When adding or changing CSS variables in a component’s
  `*.module.scss`, update the corresponding doc table.
- Where a component wraps a Radix primitive, keep the “Radix UI props” section in sync if the underlying package
  changes.
- Consider adding a short README stub inside each component folder that links to the canonical doc (optional for
  discoverability during development).
- Run and maintain Storybook stories (if present) to validate visual changes.
