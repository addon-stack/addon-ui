# Changelog

## 🚀 Release `addon-ui` v0.11.0 (2026-03-13)


### ✨ Features

* **Popover:** add Popover component with subcomponents ([3077350](https://github.com/addon-stack/addon-ui/commit/307735071b1dfd831bbec300502e31b2e8ad5fe5))


* **Shift:** add Shift component ([06712c6](https://github.com/addon-stack/addon-ui/commit/06712c63427cd2bda786aad6dd0690c13f3a4fe6))


* **ToggleGroup:** add ToggleGroup component ([b724242](https://github.com/addon-stack/addon-ui/commit/b724242a6f371fcfcf02a9c184cfe9f0e0cd179d))




### 📝 Documentation

* **Popover:** add comprehensive documentation for Popover and its subcomponents ([1aa982c](https://github.com/addon-stack/addon-ui/commit/1aa982ca8bcab43ac5acf864d0e1ce2cd04ddfab))


* **README:** update component list with Popover, Shift, and ToggleGroup links ([1795272](https://github.com/addon-stack/addon-ui/commit/1795272639c3353fb83f6be2b81398534e73c5b0))


* **Select:** update documentation to include new subcomponents and enhanced props ([565ad7d](https://github.com/addon-stack/addon-ui/commit/565ad7d840b35c422dd432b6818624a30a6e27fd))


* **Shift:** add comprehensive documentation for Shift component ([2281f71](https://github.com/addon-stack/addon-ui/commit/2281f71f05a36bd4bed87208b0563bef2869a40b))


* **ToggleGroup:** add documentation for ToggleGroup and its subcomponents ([46094a6](https://github.com/addon-stack/addon-ui/commit/46094a6b6545d4daa7715a0dea03c9eff3c71f0f))


* **ToggleGroup:** improve readability and update table formatting in documentation ([dfa9843](https://github.com/addon-stack/addon-ui/commit/dfa984378c816f096dcccd0d30a07b4f6037c30b))




### 🤖 CI

* **workflow:** add OIDC diagnostics and registry URL to release workflow ([897e12f](https://github.com/addon-stack/addon-ui/commit/897e12f46a66c559acc9bcfcd12efe3ba6e37cec))


* **workflow:** add permissions and update npm in release workflow ([952bce1](https://github.com/addon-stack/addon-ui/commit/952bce1cec53804419522a3d15e155acfad0948a))


* **workflow:** remove npm update step ([a96c99c](https://github.com/addon-stack/addon-ui/commit/a96c99cb962780130f45ecc1811cf918d561b6aa))




### 🧩 Other

* set `overflow: hidden` for body in reset styles ([b58c895](https://github.com/addon-stack/addon-ui/commit/b58c89563632cf8d577a8dac1001eac992b1961d))


* update styles for Button, TextArea, TextField, Tooltip ([d71cc2c](https://github.com/addon-stack/addon-ui/commit/d71cc2c8ba0825a8d0416d923fb750f031fd9fa2))




### 🛠️ Refactoring

* **eslint:** remove deprecated Storybook eslint config and update ignore patterns ([89f5dbb](https://github.com/addon-stack/addon-ui/commit/89f5dbb5b9dd3f3907f9bf7e24b9cf67372c7a73))


* migrate to `storybook-react-rsbuild` and update related peer dependencies ([d3a1506](https://github.com/addon-stack/addon-ui/commit/d3a1506195279615774cd60f6662521f00795f8e))

  - Replaced `@storybook/react` with `storybook-react-rsbuild` in all components and configurations.
  - Updated `storybook`, `storybook-react-rsbuild`, and their related plugins to the latest versions.
  - Added missing peer dependencies, such as `eslint-plugin-storybook`.
  - Adjusted `.gitignore` to include `storybook-static` folder.
  - Updated `package.json` with updated author details and removed contributors property.
  - Removed unused dependencies from `package-lock.json` for a cleaner build.

* **Select:** improve Select component ([0113fab](https://github.com/addon-stack/addon-ui/commit/0113fabfeabdd1544ad67b6213f56f41478db5ac))


* **Shift:** update type checks and improve style merging logic ([08519ec](https://github.com/addon-stack/addon-ui/commit/08519ecccbcf3fa0adcc1b28fbe6003c2f7cfee0))


* **types:** make various component props optional ([db18054](https://github.com/addon-stack/addon-ui/commit/db1805400baec60313da3c688faee8ae03df3a73))





### 🙌 Contributors

- [Anjey Tsibylskij](https://github.com/atldays) (@atldays) — commits: 16
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 8

## 🚀 Release `addon-ui` v0.10.0 (2026-02-04)


### ✨ Features

* **plugin:** extend plugin options and improve splitChunks logic ([894a43c](https://github.com/addon-stack/addon-ui/commit/894a43c7639373ab2c1d985741522d74cdd56c2e))

  - Added new plugin options: `themeDir`, `configName`, `styleName`, and `splitChunks`.
  - Enhanced `splitChunks` logic with callback support and refined naming conventions.
  - Replaced redundant `toKebabCase` logic with lodash's `kebabCase` for better consistency.
  - Optimized chunk naming to support component groups like `button`, `list`, and `view`.

* **TextField:** add strict number input mode with sanitization logic ([09e3a79](https://github.com/addon-stack/addon-ui/commit/09e3a791d241bb1d6dc474477dd2eef45d3e1382))


* **Truncate:** improve text truncation logic, introduced `render` prop ([c5148a6](https://github.com/addon-stack/addon-ui/commit/c5148a6fa8ab6dc740f1e00511e801b7f5b1852e))




### 🐛 Bug Fixed

* **plugin:** correct spacing in conditional for resource.includes check ([1a8eaa1](https://github.com/addon-stack/addon-ui/commit/1a8eaa16affc69734196e0e025075cb6264f12ae))




### 📝 Documentation

* add `strict` prop to TextField and enhance Truncate functionality ([b117c2d](https://github.com/addon-stack/addon-ui/commit/b117c2d81f5515690c9164adce7470ab9cd517f3))


* **README:** update documentation for components, plugin options, and theming ([dd7c2ee](https://github.com/addon-stack/addon-ui/commit/dd7c2eecf842e767071fdb500a5bf09957540153))




### 🧩 Other

* **Truncate:** enhance code readability and consistency with formatting adjustments ([bfe60ca](https://github.com/addon-stack/addon-ui/commit/bfe60ca8a7f0b70ace4a0fd4ce61f483f608c970))




### 🧹 Chores

* **deps:** update `adnbn` to v0.5.7 and simplify override configuration ([d6a0ba1](https://github.com/addon-stack/addon-ui/commit/d6a0ba121f52411c295afd43e2d02ba50c7f6730))




### 🛠️ Refactoring

* enhance theme handling and rename plugin options ([1cb3a58](https://github.com/addon-stack/addon-ui/commit/1cb3a58ad1bf02688fd5573e8574ae48a9319381))


* **plugin:** enhance splitChunks logic with improved naming and module handling ([10206b7](https://github.com/addon-stack/addon-ui/commit/10206b7ebba1d16b15540c017526eb3d0eccfedd))


* **plugin:** rename file-related options and add splitChunks optimization logic ([46ada1d](https://github.com/addon-stack/addon-ui/commit/46ada1d1712f7445835f72bee56f5c851aa70d82))


* **Select:** add explicit `type` modifier to exported props ([3667446](https://github.com/addon-stack/addon-ui/commit/3667446a15cbf90d602e534aaa378b806dd25622))


* **ThemeProvider:** add `container` and enhance `storage` prop flexibility ([563ad34](https://github.com/addon-stack/addon-ui/commit/563ad346d93111d5d6eea1fa31640de47b6ff485))

  - Introduced `container` prop to customize DOM element for attribute handling.
  - Enhanced `storage` prop for better persistence with custom and default options.
  - Updated SCSS mixins for dynamic attribute context support.
  - Synced `UIProvider` to pass `container` prop to `ThemeProvider`.

* **Truncate:** extract `calculateMiddleTruncate` to a utility file and clean up styles and stories ([26c258a](https://github.com/addon-stack/addon-ui/commit/26c258a7dea3e64dca2c050e53784dcfdbfbb9ba))


* **UIProvider:** add `container` prop for custom DOM element attribute handling ([2cebafc](https://github.com/addon-stack/addon-ui/commit/2cebafc33fb4d3496b578d43c6b0009c0c1afcfa))





### 🙌 Contributors

- [Anjey Tsibylskij](https://github.com/atldays) (@atldays) — commits: 12
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 5
- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 2

## 🚀 Release `addon-ui` v0.9.2 (2026-01-26)


### 🤖 CI

* **release:** update npm configuration and workflow for version consistency ([b5ad1af](https://github.com/addon-stack/addon-ui/commit/b5ad1af20fab953881efb66fe6944748411815bf))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 1
- [Anjey Tsibylskij](https://github.com/atldays) (@atldays) — commits: 1

## 🚀 Release `addon-ui` v0.9.1 (2026-01-26)


### 🤖 CI

* **release:** specify npm registry in `release-it` configuration ([96d480e](https://github.com/addon-stack/addon-ui/commit/96d480e294171241256e9b8bbccb010d10f27583))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 1
- [Anjey Tsibylskij](https://github.com/atldays) (@atldays) — commits: 1

## 🚀 Release `addon-ui` v0.9.0 (2026-01-26)


### ✨ Features

* **Select:** add Select component and related subcomponents with styles ([edc98ef](https://github.com/addon-stack/addon-ui/commit/edc98ef66ba2ad1571c2d6d808f661082dee21f5))




### 📝 Documentation

* **Select:** add documentation for the Select component and its subcomponents ([eb4f35f](https://github.com/addon-stack/addon-ui/commit/eb4f35fb380cf92b31ce248148c9b0a269f3c12f))




### 🧩 Other

* fix(TextArea, TextField): ensure onChange is called after setting value ([e549319](https://github.com/addon-stack/addon-ui/commit/e54931977b530ec04d5cdd014a23242e56480a2e))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 2
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 2
- [Anjey Tsibylskij](https://github.com/atldays) (@atldays) — commits: 1

## 🚀 Release `addon-ui` v0.8.0 (2026-01-19)


### ✨ Features

* **Truncate:** add debounce functionality for improved performance on resize ([b7d7029](https://github.com/addon-stack/addon-ui/commit/b7d70291d16471ffccd02b4a5a0265bdfa37f0b6))


* **Truncate:** add highlight functionality and improve layout in Truncate component ([ef550ab](https://github.com/addon-stack/addon-ui/commit/ef550ab9b032e7d50b695764ee6cb605bf7264ca))




### 🐛 Bug Fixed

* fix hooks usage and format code ([21fc601](https://github.com/addon-stack/addon-ui/commit/21fc6010791db3155dbc6c7262577e03436c1602))




### 📝 Documentation

* fix spacing inconsistencies in prop tables ([a121239](https://github.com/addon-stack/addon-ui/commit/a12123922cf19acf421f8aa852cfbb4c1528b737))




### 🤖 CI

* **release:** update `release-it` config and workflow for improved npm handling ([46ef514](https://github.com/addon-stack/addon-ui/commit/46ef51476a69830e1181419da3e56c55343b14ff))




### 🧹 Chores

* **deps:** update dependencies in `package.json` and `package-lock.json` ([7047c7f](https://github.com/addon-stack/addon-ui/commit/7047c7f59c26e4386ef3042a82b3888afc69fdcf))




### 🛠️ Refactoring

* **Highlight:** update class handling and extract highlight styles ([b1fbf25](https://github.com/addon-stack/addon-ui/commit/b1fbf256f85d3e06a4314f2221186ab35228c1ea))


* improve styles for components - accordion, checkbox, modal, tabs ([305d4d7](https://github.com/addon-stack/addon-ui/commit/305d4d719e506b49bec22b8f2d407b1e27e8ab38))





### 🙌 Contributors

- [Anjey Tsibylskij](https://github.com/atldays) (@atldays) — commits: 4
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 4
- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 2

## 🚀 Release `addon-ui` v0.7.1 (2025-12-08)


### 🐛 Bug Fixed

* **TabsList:** fix debounce invocation in TabsList ([7ea2b68](https://github.com/addon-stack/addon-ui/commit/7ea2b6816dc2aea6b20a787cd217baae281e466c))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 2
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 2

## 🚀 Release `addon-ui` v0.7.0 (2025-12-06)


### ✨ Features

* add Accordion component and its related stories, styles, and subcomponents ([41d13ad](https://github.com/addon-stack/addon-ui/commit/41d13adc5dd6cccf2cdf275299afadd7c2ac6380))




### 📝 Documentation

* **accordion:** add comprehensive documentation for Accordion component ([c95e022](https://github.com/addon-stack/addon-ui/commit/c95e0222daabeb190f4066dea0f70987e86b4f9e))


* **readme:** update component list with new documentation links ([3fc2cc9](https://github.com/addon-stack/addon-ui/commit/3fc2cc90e87bfe7954fc82b61727cc512afc09bf))


* **tabs:** add comprehensive documentation for Tabs component ([de9c7b6](https://github.com/addon-stack/addon-ui/commit/de9c7b68816a7588b21fc22a018b163b8c73404d))


* **tooltip:** add comprehensive documentation for Tooltip component ([da3eb0d](https://github.com/addon-stack/addon-ui/commit/da3eb0d6ff94dda5774073af9825a1141f950278))


* **truncate:** add comprehensive documentation for Truncate component ([73beb14](https://github.com/addon-stack/addon-ui/commit/73beb14267562a7d3ac9c55a3f5f8ff707a9e1eb))


* **truncatelist:** add comprehensive documentation for TruncateList component ([cead80e](https://github.com/addon-stack/addon-ui/commit/cead80efe3c08d4be856096806a3aff85b26daea))


* update documentation with component-scoped speed variables ([52e799d](https://github.com/addon-stack/addon-ui/commit/52e799d55a6b12b5f8a8d9bdafc7b2492b128828))




### 🛠️ Refactoring

* adjust debounce logic in TabsList to improve consistency ([00aa675](https://github.com/addon-stack/addon-ui/commit/00aa67572e20957c18c6a0d2260b857695cc8523))


* improve consistent formatting in components and styles ([9fbfc0e](https://github.com/addon-stack/addon-ui/commit/9fbfc0e8133ce38cfdfeabe2863eb6957ca897e0))


* replace `transition-speed-*` variables with scoped `speed-*` variables across styles ([1f45a58](https://github.com/addon-stack/addon-ui/commit/1f45a58df14b269873c1175c16377979770ce4ce))


* replace transition-speed-sm with transition-speed-color across styles ([08860da](https://github.com/addon-stack/addon-ui/commit/08860da0f9f189906ed681dbf0fb29f18e826d0e))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 10
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 5

## 🚀 Release `addon-ui` v0.6.1 (2025-11-28)


### 🧹 Chores

* **ci:** improve readability of `release-it` configuration ([4fb1117](https://github.com/addon-stack/addon-ui/commit/4fb1117c520fbbe1a2fcc89243b490c3967d62b4))




### 🛠️ Refactoring

* add RTL support for TextField and optimize resize handling in Truncate component ([4d24c19](https://github.com/addon-stack/addon-ui/commit/4d24c19249a2ecfccc5d0e1a5b8b4042afb7fcd3))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 3
- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 1

## 🚀 Release `addon-ui` v0.6.0 (2025-11-21)


### ✨ Features

* add Tabs component ([9a2ac2c](https://github.com/addon-stack/addon-ui/commit/9a2ac2cacb38f95f16c3033d314e803ae43b4341))


* add Truncate component ([6a29150](https://github.com/addon-stack/addon-ui/commit/6a291501094a8c4711207f1d55fa7a749bfd0aaa))


* add TruncateList component ([e293017](https://github.com/addon-stack/addon-ui/commit/e2930178906f0b757fdc28fa1ba4be87f2aaff54))


* **ci:** enhance release-it config with release rules and bump determination logic ([b44da4a](https://github.com/addon-stack/addon-ui/commit/b44da4afb965f45deb9fe7f6a62d3b81f2cfc1f5))




### 🧹 Chores

* cleanup unused file ([dce714a](https://github.com/addon-stack/addon-ui/commit/dce714a57be517b3fca859571da9886fcf2e6ab2))


* **deps:** bump dependencies in `package-lock.json` to latest versions ([47b1a28](https://github.com/addon-stack/addon-ui/commit/47b1a28f94ba249280675cec197e7cb8359cefd4))


* sync package-lock.json ([385dbc5](https://github.com/addon-stack/addon-ui/commit/385dbc51424bdc5663fdb93866628c2e6d6602e3))


* update package.json ([72a3cde](https://github.com/addon-stack/addon-ui/commit/72a3cdeeb26611a9ffbf9daedd5f18f423b139a3))




### 🛠️ Refactoring

* add type casting for OverflowList props in TruncateList component ([3e722d0](https://github.com/addon-stack/addon-ui/commit/3e722d078191fef3bd4c8666733dc35dc005856c))


* apply consistent formatting and improve code readability ([65f7684](https://github.com/addon-stack/addon-ui/commit/65f7684183fede0e872dfc6d84842d83b398caf0))


* fix eslint-related code issues ([ea31327](https://github.com/addon-stack/addon-ui/commit/ea31327c8a9053da0884d3d7ca4e3ce5393234d8))


* improve components styles and internal logic ([3a95072](https://github.com/addon-stack/addon-ui/commit/3a95072c093b128746ab4cec40972023e0fe6170))


* update styles for Avatar, List, ListItem, ScrollArea, Tag ([9f9e0c3](https://github.com/addon-stack/addon-ui/commit/9f9e0c335f4ebad0aca4ec010a8f8b8a738c47af))





### 🙌 Contributors

- [Rostyslav Nihrutsa](https://github.com/RostyslavNihrutsa) (@RostyslavNihrutsa) — commits: 10
- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 6

## 🚀 Release `addon-ui` v0.5.0 (2025-10-17)


### ✨ Features

* **ScrollArea:** add `scrollTo` support and improve imperative handle usage ([2a752d1](https://github.com/addon-stack/addon-ui/commit/2a752d1ba2413a1d1faeee54bf40b3af725ea0b0))


* **ScrollArea:** add `viewportRef` and `viewportProps` support, update transitions in styles ([0ce3323](https://github.com/addon-stack/addon-ui/commit/0ce3323ceb520caafb83d141bd31c39d5a88a96a))


* **styles:** add `view` mixin for scoped styling based on view attributes ([1f098fb](https://github.com/addon-stack/addon-ui/commit/1f098fb60dd6d9f34cd6555b07fb685cf02328d3))


* **styles:** extend transition properties to include `border-color` and `background` ([46cb160](https://github.com/addon-stack/addon-ui/commit/46cb16003df2d85d8f10e972aa52dddd3d416dd0))


* **Viewport:** add transition support with `withTransition` control and scoped styles ([3652483](https://github.com/addon-stack/addon-ui/commit/36524838099e7e32899dc821131b3eb60660ab3c))




### 🐛 Bug Fixed

* **Tooltip:** set default value for `delayDuration` prop ([ea29ff2](https://github.com/addon-stack/addon-ui/commit/ea29ff224e5a0e26f81157b015531d60fd8fe5c8))




### 🛠️ Refactoring

* **types:** update `tooltip` type to omit `content` property in `TooltipProps` ([5231c3e](https://github.com/addon-stack/addon-ui/commit/5231c3e28c1f54f3d76568a5893bd1b7e2a2c84d))





### 🙌 Contributors

- [Rostyslav Nihrutsa](mailto:rostyslav.nihrutsa@gmail.com) — commits: 8
- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 2

## 🚀 Release `addon-ui` v0.4.2 (2025-10-14)


### ⚡️ Performance Improvements

* enhance type declaration support and refactor build process ([e9ada45](https://github.com/addon-stack/addon-ui/commit/e9ada451902850c6ab31e322954bf6a42eb7540b))

  - Updated `types` field in `package.json` to point to generated type declarations.
  - Modified `exports` to include type declarations for components (`config`, `plugin`, etc.).
  - Added `tsconfig.build.json` to generate declaration files in the `dist-types` directory.
  - Added `prepublishOnly` script to automate type generation during publishing.
  - Updated `.gitignore` and ESLint configuration to include `dist-types`.
  - Introduced type definitions for `odometer` and `addon-ui-config` modules.



### 🤖 CI

* update build and CI scripts to include type generation ([186eab3](https://github.com/addon-stack/addon-ui/commit/186eab3b97430cc6ca979ec5585fef63f8bcf682))

  - Updated `.husky/pre-push` to replace commented-out commands with `npm run build:types`.
  - Modified GitHub Actions workflow to add a step for running `npm run build:types` during CI.



### 🧹 Chores

* remove `.npmignore` and update `package.json` file patterns ([d902232](https://github.com/addon-stack/addon-ui/commit/d902232d91eb716420f1ed249b798755258db5c2))


* update .prettierignore to include CHANGELOG.md ([e2d51ac](https://github.com/addon-stack/addon-ui/commit/e2d51ac41251cdb01cdd94318a8871b13496245d))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 6

## 🚀 Release `addon-ui` v0.4.1 (2025-10-14)


### 🐛 Bug Fixed

* update release-it config and ignore additional files in npm package ([d5ac894](https://github.com/addon-stack/addon-ui/commit/d5ac89444573081c89646c863942e86d6e40050a))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 2

## 🚀 Release `addon-ui` v0.4.0 (2025-10-14)


### ✨ Features

* **styles:** add new scss mixins, add `view` prop to UIProvider ([6f68bde](https://github.com/addon-stack/addon-ui/commit/6f68bde44b326dfa1b0a44ae94706b011b94902c))




### 🐛 Bug Fixed

* **styles:** correct variable assignment for `--viewport-max-width` ([6d795c4](https://github.com/addon-stack/addon-ui/commit/6d795c484c79e6004bfaeaefdebad98114c16da9))




### 📝 Documentation

* add comprehensive usage documentation for SvgSprite, Modal, List, ScrollArea, and Odometer ([b5145e8](https://github.com/addon-stack/addon-ui/commit/b5145e8ebe17841c169ba869573ca7907ae423dd))


* add comprehensive usage guides for Icon and IconButton components ([dd22027](https://github.com/addon-stack/addon-ui/commit/dd2202725f0049658c432399ea61dc91adecc7ef))


* add documentation for Header, Footer, Highlight, and Drawer components ([df4fe74](https://github.com/addon-stack/addon-ui/commit/df4fe741dde80e2e2061c0fefce5cb2d4e6aca37))


* add documentation for Switch, TextArea, and Tag components ([a1882ea](https://github.com/addon-stack/addon-ui/commit/a1882ea565bbcd19baa37e0108b89d56947bc297))

  - Introduced detailed usage guides, examples,
    and prop descriptions for the new `Switch`, `TextArea`, and `Tag` components.
  - Included theming and global configuration details for each component.
  - Enhanced accessibility (A11y) notes to promote best practices.
  - Updated imports in `Modal` documentation for consistency.

* add documentation for Toast and TextField components, clean up unused variables ([f84b8d2](https://github.com/addon-stack/addon-ui/commit/f84b8d2c2481859f936d46a00357fdc78cf6d6d8))

  - Introduced comprehensive documentation for the `Toast` and `TextField` components,
    including usage guidelines, theming options, and accessibility considerations.
  - Removed unused CSS variables across multiple component documentation
    (`Header`, `Footer`, `Modal`, `Avatar`, etc.) to improve clarity and maintain consistency.

* add documentation for View and ViewDrawer components, remove unused CSS variables ([9f16980](https://github.com/addon-stack/addon-ui/commit/9f16980acfe33c524d7e6e1f934784f246e4a7fd))

  - Introduced comprehensive documentation for the new `View` and `ViewDrawer` components,
    including usage examples, props, theming options, and accessibility guidelines.
  - Removed unused CSS variables across multiple component documentation
    (`TextField`, `TextArea`, `Tag`, `ScrollArea`) for improved clarity and consistency.

* add documentation for ViewModal and Viewport components ([5573dbf](https://github.com/addon-stack/addon-ui/commit/5573dbfa9ae7f468a2b353fc905027e1d941048a))

  - Introduced comprehensive documentation for the `ViewModal` and `Viewport` components,
    including usage examples, props, theming options, and accessibility guidelines.
  - Enhanced explanation of available CSS variables for better clarity.
  - Updated `UIProvider` to include `ViewModal` configuration options.

* add line spacing for improved readability in Radix props sections ([2d72500](https://github.com/addon-stack/addon-ui/commit/2d72500f52c5d7794ebf5052e5939f0bdd508dde))


* add usage documentation for Button, Avatar, and Checkbox components ([8b23ddf](https://github.com/addon-stack/addon-ui/commit/8b23ddf7c887bd3790cd8e71fcaac3690739e809))

  - Introduce detailed documentation for `Button`, `Avatar`, and `Checkbox` components,
    including examples, props, theming, and accessibility guidelines.
  - Highlight CSS variables usage and fallback mechanisms for style customization.
  - Provide guidance on global configuration via `UIProvider` and `ui.config.ts`.

* enhance formatting in `Dialog.md` for improved readability and consistency ([bb0a377](https://github.com/addon-stack/addon-ui/commit/bb0a377119d0fe357912f86633d842145aed590f))


* fix formatting, spacing, and improve consistency in README ([0105559](https://github.com/addon-stack/addon-ui/commit/010555937b328ffbb2b753c551f16113eaeea63d))


* update and expand documentation, correct naming, and add policies ([1a7d18f](https://github.com/addon-stack/addon-ui/commit/1a7d18f960f8152be238ddba23a9ea9d8cb82ed0))


* update Avatar, Checkbox, and add Dialog documentation with Radix UI props and theming details ([35d8710](https://github.com/addon-stack/addon-ui/commit/35d8710004dff94c889f7f51cf8a8ef63bb7a231))

  - Added Radix UI props section to Avatar and Checkbox documentation,
    listing commonly used props and linking to official Radix documentation.
  - Introduced comprehensive Dialog documentation, including import usage, props,
    Radix UI integration, CSS variables, theming, global configuration, and accessibility guidelines.



### 🤖 CI

* add GitHub Actions workflows for CI and release ([053dae2](https://github.com/addon-stack/addon-ui/commit/053dae2695e1d32c00e3388f0ce2aa066aed8354))


* configure Husky hooks, add commitlint, and update dependencies ([682f9a3](https://github.com/addon-stack/addon-ui/commit/682f9a378aea01a08ca9c31d02a96b6f48d3e3c0))

  - Added `.husky` directory with pre-commit, pre-push, and commit-msg hooks.
  - Integrated `commitlint` for validating commit messages.
  - Updated `package.json` to include related scripts (`test:related`, `typecheck`, etc.).
  - Added `.mailmap` for contributor aliasing and `.release-it.cjs` for automated releases.
  - Updated dependencies and added new ones: `husky`, `jest`, `release-it`, etc.
  - Updated `tsconfig.json` to adjust include and exclude patterns.
  - Added `.gitattributes` for consistent line endings.

* rename `build-and-test` job to `testing` for clarity and alignment with functionality ([cc8ee2c](https://github.com/addon-stack/addon-ui/commit/cc8ee2cf19688b0e9cc4cfdd6f3c95a7ac2b44b6))


* update Node.js version to 22 in CI and release workflows ([399d122](https://github.com/addon-stack/addon-ui/commit/399d122cf20cab3094da332e220aef370cb967ee))




### 🧹 Chores

* **mailmap:** update email mappings for consistent author attribution ([c9fb2ff](https://github.com/addon-stack/addon-ui/commit/c9fb2ff1c0bef3cb7d1461c57f77360e1c893de4))


* **prettierignore:** add workflow YAML files to prettier ignore settings ([59a05cb](https://github.com/addon-stack/addon-ui/commit/59a05cb2884cfc91a2cfb0122735c4d795cd290c))


* update dependencies and add overrides for compatibility ([52a868b](https://github.com/addon-stack/addon-ui/commit/52a868b13c9bf3995c850a5e794b3deba403a414))

  - Bump `adnbn` to `^0.4.2` and update multiple `@babel` packages to `7.28.4`.
  - Remove unused `@biomejs/biome` and associated optional dependencies.
  - Add `overrides` in `package.json` for `flat-cache`, `html-rspack-tags-plugin`, and `test-exclude`.
  - Include new dependencies: `@cacheable/memoize`, `@cacheable/memory`, and `@cacheable/utils`.
  - Replace `@ampproject/remapping` with `@jridgewell/remapping`.

* update dependencies and bump versions in package-lock.json and package.json ([4e7b367](https://github.com/addon-stack/addon-ui/commit/4e7b36774addaf93958d9dac4e0998de47e41ddf))




### 🛠️ Refactoring

* **docs:** improve formatting consistency across Button, Avatar, and Checkbox documentation ([2691387](https://github.com/addon-stack/addon-ui/commit/2691387a8f833e2f73e85c94865976e9ddcf4bec))


* enhance the Layout component and rename to Viewport ([55ddeda](https://github.com/addon-stack/addon-ui/commit/55ddedadc35dd5195371d88eb1616e914cefb083))


* enhance ThemeProvider with dynamic storage initialization ([3e2ecac](https://github.com/addon-stack/addon-ui/commit/3e2ecac11f066d3bc4aaca2439ba45356fc88213))


* handle `getBrowser` errors in ThemeProvider, update ThemeStorage import path ([1b21b20](https://github.com/addon-stack/addon-ui/commit/1b21b20af0503bf933f2c7b27b7c8a52b4a9544e))


* improve code readability with consistent formatting and semicolon usage ([3e82e35](https://github.com/addon-stack/addon-ui/commit/3e82e35d79719af7b7d0d363935cb5b7178b40b9))


* standardize SCSS formatting and improve code consistency ([530be72](https://github.com/addon-stack/addon-ui/commit/530be72c62f581ce570396cc0da4ab00cf6b4cff))


* **styles:** add RTL support and animations for Modal, Footer, and other components ([1afcaaf](https://github.com/addon-stack/addon-ui/commit/1afcaaff6239340d3ce366c7246b62ec48ab1452))





### 🙌 Contributors

- [Addon Stack](https://github.com/addon-stack) (@addon-stack) — commits: 29
- [Rostyslav Nihrutsa](mailto:rostyslav.nihrutsa@gmail.com) — commits: 10
