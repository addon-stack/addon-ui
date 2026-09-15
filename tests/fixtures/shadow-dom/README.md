# Shadow DOM extension fixture

This private npm package is an input to the repository's automated integration and browser suites. It links addon-ui through `file:../../..` and installs published **AddonBone 0.12.0** from npm. No framework snapshot or preparation script is needed. Install and run tests from the repository root using the [test commands](../../README.md).

The content script passes the framework-injected `container` and `boundary` directly to `UIProvider`. Its custom `target` is the React mount element; browser checks verify that modal portals stay in the same ShadowRoot outside that target.

The extension includes an ordinary popup, two independent ShadowRoots, shared UI components and a lazy module. Its English locale catalogue satisfies Select's framework locale dependency. Explicit runtime and TypeScript aliases keep the linked library on the fixture's framework installation.

All tested stylesheet imports use AddonBone's standard `?isolation` routing, including the library's virtual overrides and the fixture's lazy CSS. The `bundler` hook supplies dependency aliases and records Rspack statistics; it does not modify CSS rules. AddonBone owns extraction, chunk splitting, manifest/WAR generation and delivery into each ShadowRoot.

The build suite checks that CLI, declarations and runtime resolve to the same published package, that library styles stay out of the website's content-script CSS list, and that initial/lazy CSS is available through WAR. It also checks the isolated loader identity and shared popup stylesheet. The browser suite verifies that these assets actually load and style the components.

Generated `.adnbn/`, `dist/`, `artifacts/` and `node_modules/` are ignored. The fixture itself is committed so clean clones and CI use the same inputs. It is excluded from the published addon-ui package.
