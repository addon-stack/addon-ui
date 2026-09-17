# Testing

All automated checks and their inputs live in this directory. The fixture is a private npm package committed with its lockfile; it uses the current library source and the published AddonBone dependency. It has no dependency on a sibling checkout or a developer's manual extension.

## Layout

| Directory              | Responsibility                                                                                | Runner                                     |
| ---------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `unit/`                | Release tooling in Node                                                                       | Jest `unit` project                        |
| `plugin/` | Virtual sources, Sass composition/resources, watch lifecycle and packed fallbacks | Jest `plugin` project |
| `components/`          | Real React/Radix wrappers: portal resolution, pending containers and focus lifecycle          | Jest `components` project, jsdom           |
| `integration/`         | Extension builds, dependency resolution, isolated CSS, WAR and declarations                   | Playwright `build` project                 |
| `e2e/`                 | Styles, dialogs, Select, Toast and popup behavior in installed extensions                     | Playwright `chrome` and `firefox` projects |
| `fixtures/shadow-dom/` | Extension source, configuration and locked dependencies used by integration and browser tests | AddonBone                                  |
| `fixtures/sites/`      | External website documents used by browser tests                                              | Local HTTP server                          |
| `support/`             | Shared environment setup, build verification and browser fixtures                             | Imported by tests                          |

Keep assertions in the suite that owns the behavior. Shared helpers provide setup and teardown; they do not replace real components with simplified implementations. Name Jest tests `*.test.cjs`, `*.test.ts` or `*.test.tsx` in their respective directories, and build/browser tests `*.spec.mjs`.

## Setup

Run from the repository root:

```sh
npm ci
npm run test:install
npx playwright install chromium firefox
```

The fixture installation is needed only for integration/browser checks. On Linux, use `npx playwright install --with-deps chromium firefox` to install system dependencies as well. `PLAYWRIGHT_BROWSERS_PATH` can select a different browser cache.

## Commands

| Command                    | Checks                                                        |
| -------------------------- | ------------------------------------------------------------- |
| `npm test`                 | All Jest projects and tooling checks                                            |
| `npm run test:unit`        | Node tests only                                               |
| `npm run test:plugin` | Rspack generation, watch and package fallback tests |
| `npm run test:components`  | jsdom component tests only                                    |
| `npm run test:ci`          | All Jest projects with coverage                              |
| `npm run typecheck:tests`  | Component/plugin test and setup types                                |
| `npm run test:integration` | Single/Multi builds for both browsers and their assertions; no browser launch |
| `npm run test:e2e`         | Build dependencies, then all Chrome and Firefox scenarios     |
| `npm run test:all`         | Jest, integration and browser checks                          |
| `npm run test:report`      | Last Playwright HTML report                                   |

For a focused rerun against existing, current builds:

```sh
npm run test:components -- --runTestsByPath tests/components/toast.test.tsx
npm run test:e2e -- --project=chrome --grep 'Toast' --no-deps
npm run test:e2e -- tests/e2e/customization.spec.mjs --no-deps
```

Omit `--no-deps` after changing the library or fixture. Browser tests fail if an expected build is missing; they never fall back to another extension directory.

## Execution and diagnostics

Jest and Playwright each default to two workers. The build project runs sequentially because both browser targets share the fixture's generated-module directory. Each of the Single and Multi applications is built once per browser target (four builds), then reused by its browser scenarios. A worker owns one temporary browser profile and local HTTP server; each scenario opens a fresh document. Playwright pages close after diagnostics; the Multi fixture closes the previous Firefox extension tab before opening the next, and browser teardown closes the final tab. No browser scenario depends on a preceding scenario's UI state. Use the runner's `--workers` option to reduce concurrency when necessary.

Playwright reports every scenario separately, without automatic retries. Failures retain screenshots and a trace; every scenario attaches runtime diagnostics, and build tests attach compiler output and verification results. HTML/JUnit reports and traces go to ignored `test-results/`. Rspack statistics stay in the fixture's ignored `artifacts/` directory. Temporary browser profiles are removed during teardown.

CI runs Jest, lint, types and declarations in one job, and the two-browser suite in a separate job. Coverage and browser diagnostics are uploaded independently.

## Scope of evidence

jsdom tests exercise the real wrappers and Radix, while stubbing stylesheet imports, framework/storage boundaries and unsupported layout APIs. They do not prove native scrolling, CSS cascade or browser focus behavior; the extension tests cover those.

Both browser projects install and run the actual emitted extension. Chrome interaction tests use native Playwright input, including in the popup document. The customization tests use DOM clicks/key events and read native computed styles in both popup documents. Firefox content-script tests also use native input. Playwright does not expose Firefox extension documents, so the Firefox popup helper uses its local debugging protocol and DOM events. Both popup documents open in extension tabs; these checks do not exercise the browser toolbar surface. Native touch scrolling is checked in Chrome; Firefox checks composed touch-event propagation only.

Console errors, console warnings and page errors from Playwright-observable pages fail the scenario without Radix-specific exceptions. Firefox popup evaluations report exceptions through RDP, but those extension pages do not have Playwright console monitoring. Dialog tests also verify accessible names and descriptions inside ShadowRoot. See [the fixture](./fixtures/shadow-dom/README.md) for CSS delivery details and [recorded validation](./VALIDATION.md) for the latest local results.

## Customization regressions

`e2e/customization.spec.mjs` uses `customization.config.ts` and the fixture's
`customization/shared` and `customization/apps/customization` sources. Both browser
projects exercise real `Workspace.Multi` stylesheet composition and the UI plugin.

- The consumer's TabsTrigger case combines shared layout with app colors and state rules.
- A second case moves emitted library layer blocks after application CSS and repeats the assertions.
- Theme mixins, local variables, a single application class, app-over-shared priority and an explicit
  application layer are checked against computed Button styles.
- Focus/accents, TextArea fullWidth, Modal fullscreen/close positioning and the ScrollArea display
  variable cover representative former `!important` declarations and their supported overrides.
- Tag is loaded through a real dynamic import. Its stylesheet must be absent before loading,
  appear afterwards, and preserve the earlier application class overrides.
- Both content-script ShadowRoots receive the same shared/app classes and theme variables.

Build assertions also check emitted library/application layers, unlayered application theme tokens,
empty manifest content-script CSS lists and a separate lazy Tag stylesheet. These checks complement
browser behavior; checking emitted CSS alone does not prove which declaration wins.

## Icon modes

`components/icons.test.tsx` covers mode changes, sprite registration, independent
inline instances, SVG refs and config replacement. `types/icons.tsx` checks the
public discriminated union with `npm run typecheck:tests`. Plugin tests exercise
whole-entry shared/app replacement with the real compiler. `e2e/icons.spec.mjs`
loads SVG files through the framework and checks sprite/inline/asset rendering,
custom colors, resource URLs, lazy styles and mode changes in extension pages
and separate ShadowRoots.

Icon regression coverage also includes fixed-dimension and viewBox-only files
through the real `?react` loader, plus pixel samples for sprite gradients,
clipPath and mask. PNGs are decoded in a browser canvas with a color tolerance;
no PNG decoder dependency or byte-for-byte screenshot comparison is used.
Firefox extension-document pixels come from its RDP screenshot actor, while
Playwright captures ShadowRoots. `plugin/config-entry.test.ts` checks development
module stats before tree shaking. Icon contracts and normalization are exported
through the component index; the config entry has no runtime dependency on them.
A production compilation also verifies that importing IconMode and getIconDefinition
from the public package entry emits only their modules, without UI components or CSS.

`components/icon-registry.test.tsx` checks render isolation with Profiler, source
replacement, stable theme/config values, public registry compatibility, Unicode ID
encoding and standalone sprites. `e2e/icon-ids.spec.mjs` checks actual `<use>` rendering
for application-ID collisions, nested/sibling providers and portals in both ShadowRoots
and extension documents. `tooling/public-exports.test.mjs` uses the TypeScript checker
to compare package and config exports, including erased types, against the committed list.
