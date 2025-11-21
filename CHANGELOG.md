# Changelog

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
