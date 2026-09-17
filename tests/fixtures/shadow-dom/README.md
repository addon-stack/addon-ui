# Shadow DOM extension fixture

This private npm package is an input to the repository's automated integration and browser suites. It links addon-ui through `file:../../..` and installs published **AddonBone 0.13.0** from npm. No framework snapshot or preparation script is needed. Install and run tests from the repository root using the [test commands](../../README.md).

The content script passes the framework-injected `container` and `boundary` directly to `UIProvider`. Its custom `target` is the React mount element; browser checks verify that modal portals stay in the same ShadowRoot outside that target.

The extension includes an ordinary popup, two independent ShadowRoots, shared UI components and a lazy module. Its English locale catalogue satisfies Select's framework locale dependency. Explicit runtime and TypeScript aliases keep the linked library on the fixture's framework installation.

All stylesheet imports now omit the isolation query, including the library's virtual overrides and the fixture's lazy CSS. AddonBone 0.13.0 automatically routes these styles to the content boundary or document. The `bundler` hook supplies dependency aliases and records Rspack statistics; it does not modify CSS rules. AddonBone owns extraction, chunk splitting, manifest/WAR generation and delivery into each ShadowRoot.

The build suite checks that CLI, declarations and runtime resolve to the same published package, that library styles stay out of the website's content-script CSS list, and that initial/lazy CSS is available through WAR. It also checks the automatic stylesheet loader identity and shared popup stylesheet. The browser suite verifies that these assets actually load and style the components.

Generated `.adnbn/`, `dist/`, `artifacts/` and `node_modules/` are ignored. The fixture itself is committed so clean clones and CI use the same inputs. It is excluded from the published addon-ui package.

## Multi-app customization fixture

`customization.config.ts` reuses the dependency aliases and build settings with
`Workspace.Multi`, `srcDir: "customization"` and `app: "customization"`. It uses the
same installed dependencies as the Single application, with no additional npm package.

- `customization/shared/popup.scss` contains shared component overrides.
- `customization/apps/customization/popup.scss` adds app overrides at the matching path.
- Shared and app `ui.style.scss` files exercise theme composition through the UI plugin.
- `LazyTag.tsx` imports a component whose library stylesheet loads in a separate chunk.

The build suite emits `dist/customization-chrome-mv3` and `dist/customization-firefox-mv3`
alongside the original `shadow-ui` builds. Browser fixtures choose the app explicitly.
The customization popup's test background closes previous popup tabs before acknowledging
creation, so Firefox RDP always selects a fresh extension document.

The fixture requires the framework to deliver ordinary stylesheet imports to the popup and both
existing ShadowRoots. The content-script isolation configuration and portal setup are unchanged.
