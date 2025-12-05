# addon-ui

[![npm version](https://img.shields.io/npm/v/addon-ui.svg)](https://www.npmjs.com/package/addon-ui)
[![npm downloads](https://img.shields.io/npm/dm/addon-ui.svg)](https://www.npmjs.com/package/addon-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Addon UI - A comprehensive UI component library designed for the Addon Bone framework.
This library provides a set of customizable React components with theming capabilities to build modern,
responsive user interfaces.

## Features

- 🎨 **Customizable Theming**: Easily customize the look and feel of components through theme configuration
- 🧩 **Rich Component Set**: Includes buttons, forms, layouts, modals, and more
- 🔌 **Addon Bone Integration**: Seamless integration with the Addon Bone framework
- 📚 **Storybook Documentation**: Comprehensive component documentation with examples
- 🛠️ **TypeScript Support**: Full TypeScript support with type definitions

## Table of Contents

- [Installation](#installation)
- [Components](#components)
- [Basic Usage](#basic-usage)
- [Integration](#integration)
- [Customization](#customization)
- [Using Extra Props](#using-extra-props)
- [Theming and style reuse](#theming-and-style-reuse)
- [Radix UI and third-party integrations](#radix-ui-and-third-party-integrations)
- [Icons and sprite](#icons-and-sprite)
- [Extra props](#extra-props-cross-cutting-configuration)
- [Contributing](#contributing)

## Installation

### npm:

```bash
npm install addon-ui
```

### pnpm:

```bash
pnpm add addon-ui
```

### yarn:

```bash
yarn add addon-ui
```

## Components

This library now ships with dedicated documentation files for each component in the docs/ directory. Start here:

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
- [Odometer](docs/Odometer.md) (component + useOdometer hook)
- [ScrollArea](docs/ScrollArea.md)
- [SvgSprite](docs/SvgSprite.md)
- [Switch](docs/Switch.md)
- [Tabs](docs/Tabs.md) (includes Tabs, TabsList, TabsTrigger, TabsContent)
- [Tag](docs/Tag.md)
- [TextArea](docs/TextArea.md)
- [TextField](docs/TextField.md)
- [Toast](docs/Toast.md)
- [Tooltip](docs/Tooltip.md)
- [Truncate](docs/Truncate.md)
- [TruncateList](docs/TruncateList.md)
- [View](docs/View.md)
- [ViewDrawer](docs/ViewDrawer.md)
- [ViewModal](docs/ViewModal.md)
- [Viewport](docs/Viewport.md) (ViewportProvider + useViewport)

Notes:

- Each CSS variables table lists only component-scoped variables with exact fallback chains from the corresponding \*
  .module.scss file.
- Where a component wraps a Radix UI primitive, the doc links to the official Radix docs and lists common props.

## Basic Usage

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
            configFileName: "ui.config", // Name of config files
            styleFileName: "ui.style", // Name of style files
            mergeConfig: true, // Merge configs from different directories
            mergeStyles: true, // Merge styles from different directories
        }),
    ],
});
```

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
You can import enum values from "addon-ui/config" to ensure type safety when configuring components.
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

The `addon-ui` library allows for extensive customization to create different designs for different extensions without
changing code. This is particularly useful in the Addon Bone framework where you might need to maintain multiple browser
extensions with the same functionality but different visual appearances.

### Global Theme Customization

You can customize the theme globally by passing props to the UIProvider:

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
};

function App() {
    return <UIProvider {...customTheme}>{/* Your application */}</UIProvider>;
}
```

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

- Global theme tokens (colors, typography, spacing, transitions) live in your ui.style.scss. Components consume them
  through fallbacks.
- Each component also exposes its own `--component-*` variables. See the CSS variables tables in the docs to know
  exactly what you can override.
- Light/dark modes: use `@import "addon-ui/theme";` and the provided `@include light { ... }` / `@include dark { ... }`
  mixins in your theme SCSS to scope tokens per color scheme.

## Radix UI and third-party integrations

Several components are built on Radix primitives (Dialog, Checkbox, ScrollArea, Switch, Toast) or wrap third-party
tools (react-highlight-words, odometer). Each doc links to the official API and explains which props you can pass
through.

## Icons and sprite

- Register icons in `ui.config.ts` or via `UIProvider`’s `icons` prop. The Icon component pulls symbols from the
  automatically mounted SvgSprite.
- Icons are lazily registered: a symbol is added only after an Icon with that name renders at least once.
- See docs/Icon.md and docs/SvgSprite.md for details and examples.

## Extra props (cross-cutting configuration)

Use the `extra` field in `ui.config.ts` to supply app-wide values (feature flags, labels, analytics switches) and access
them at runtime with the `useExtra()` hook. You can augment the `ExtraProps` TypeScript interface by declaration merging
for full type safety.

## Contributing

- Keep canonical end-user documentation in the `docs/` directory. When adding or changing CSS variables in a component’s
  `*.module.scss`, update the corresponding doc table.
- Where a component wraps a Radix primitive, keep the “Radix UI props” section in sync if the underlying package
  changes.
- Consider adding a short README stub inside each component folder that links to the canonical doc (optional for
  discoverability during development).
- Run and maintain Storybook stories (if present) to validate visual changes.
