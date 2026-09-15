# Test infrastructure validation — 2026-09-14

The automated extension fixture lives in `tests/fixtures/shadow-dom`. A clean `npm run test:install` succeeded with its committed lockfile and the published **AddonBone 0.11.0** package. Only addon-ui is linked through `file:../../..`; CLI, declarations and runtime all resolve to the fixture's registry installation. No sibling framework checkout or manual extension is involved.

## Package checks

- Jest: **65 tests in four suites**, split between Node and jsdom projects, including the existing release-it suite. Shared focus-hook tests additionally cover independent documents and modal ordering across ShadowRoots in one document.
- ESLint: passed, including the browser and integration JavaScript helpers.
- Root TypeScript, component test TypeScript and fixture TypeScript: passed.
- Declaration and Storybook builds: passed.
- `npm pack --dry-run --ignore-scripts`: 342 files; automated tests, fixtures, reports, old module paths and the personal extension are excluded.
- Workflow validation with `actionlint` and `git diff --check`: passed.

Coverage excludes test support code. Component assertions continue to exercise real addon-ui and Radix wrappers; mocks cover framework/storage boundaries, CSS imports and unsupported jsdom APIs. The follow-up refactor separates DOM utilities, layer registration and focus hooks, while preserving public props and CSS routing. Select navigation and Toast viewport behavior remain local to their components. Naming and dependency boundaries are recorded in [AGENTS.md](../AGENTS.md).

## Integration and browser checks

The Playwright run passed **24 checks: two build checks and 11 scenarios per browser**, in **27.4 seconds**, with no skips or retries. Each browser target is built once; browser scenarios run with two workers and fresh documents. Both extension builds verify isolated CSS loader identity, empty content-script CSS lists, initial/lazy WAR stylesheets, shared popup CSS and consistent framework resolution.

| Environment                      | Result | Input                                                         |
| -------------------------------- | ------ | ------------------------------------------------------------- |
| Chrome for Testing 153.0.8010.12 | Passed | Native Playwright keyboard/pointer and a CDP touch gesture    |
| Firefox 155.0                    | Passed | Native Playwright keyboard/pointer in content scripts         |
| Chrome popup document            | Passed | Native Playwright keyboard/pointer                            |
| Firefox popup document           | Passed | Firefox RDP console actor, DOM events and actual focus/layout |

Scenarios cover independent ShadowRoots, initial/lazy styles and SVG symbols, website reset isolation, theme/RTL/host specificity, virtual overrides, Tooltip, Modal/Drawer scroll locking, focus cycles/restoration, nested layers and removed controls. Select checks cover arrows, Home/End, typeahead, disabled items, pointer highlight and selection. Toast checks cover both focus proxies, Tab/Shift+Tab/F8, timer pause, fixed positioning, animated close, focus after Escape/button/programmatic/swipe closure, retained hidden content and whole-component removal.

A temporary intentional console-error probe verified that both browser projects fail on unexpected runtime errors and retain screenshots, trace and runtime diagnostics. The probe was removed after checking the reports. This original run allowed the known Radix ShadowRoot title lookup diagnostic; that exception was removed in the Radix upgrade recorded below.

HTML and JUnit reports are written to ignored `test-results/`; build logs and verification output are attached to the report. Fixture build statistics remain in ignored `artifacts/`. Temporary profiles are cleaned up, and the browser closes before its HTTP server to avoid waiting on speculative connections.

## Limits

These results were obtained locally on macOS with Node 24.5.0. The updated GitHub Actions jobs target Node 22 on Ubuntu; they have not been executed remotely as part of this change.

Both popup documents open in extension tabs, so the browser toolbar surface is outside this suite. Firefox popup input is dispatched through its debugging protocol because Playwright does not expose extension documents. Native Firefox touch input is not covered; composed touch-event propagation is checked in both browsers. Jest coverage describes loaded library modules and release tooling, not every component in the package.

## Virtual sources migration — 2026-09-15

- AddonBone 0.11.0; real Rspack compilers (1.7.5 in plugin tests, 1.7.12 in the extension fixture).
- `npm run verify`: lint, source/test types, tooling checks, 80 Jest tests across three projects, and declarations pass.
- Seven plugin tests cover empty sources, shared/application priority and merge flags, watch creation/edit/deletion,
  invalid SCSS/config recovery, generator failure recovery, compiler isolation, and fallback resolution from an npm archive.
- Storybook builds without virtual-module aliases. Both Chrome and Firefox extension builds pass CSS/WAR assertions.
- Browser run: 25 of 26 checks passed. Chrome's existing `Select ignores unchanged resize and preserves normal closing`
  scenario failed at the outside click; an isolated three-run repeat passed twice and failed once at the same assertion.
  The full browser suite is therefore not recorded as passing. The Select component and its browser scenario were not
  changed for this migration.
- Validation ran locally on macOS. Watch tests use filesystem polling; this is not evidence of a Windows/Linux CI run.

## SCSS composition and resources — 2026-09-15

- `npm run verify` passes: lint, source/test types, tooling checks, 98 Jest tests and declarations.
- The plugin project now has 25 tests. New cases exercise actual Sass/Rspack compilation of multiline
  `@use`/`@forward`, configuration variables, shared mixins, duplicate/conflicting directives, original-source
  ordering errors, CSS preludes, dotted module names and legacy import-only partials.
- Resource tests resolve separate shared/app modules and SVGs, including nested Sass partials and URL
  query/fragment preservation. Watch checks cover an asset edit, a partial edit, deletion and recreation.
- Storybook builds. Both real AddonBone 0.11.0 extension builds verify emitted SVGs in WAR and isolated CSS,
  unchanged isolated CSS loader identity, initial/lazy styles and shared popup CSS.
- Chrome and Firefox load and decode both root-relative-to-source and nested-partial SVGs inside ShadowRoot.
  The full browser run passes 25 of 26 checks in 34.9 seconds. The previously observed Chrome Select outside-click
  failure recurs at `tests/e2e/select.spec.mjs:27`; this run is not a fully passing browser suite.
- The new path handling covers literal URLs in merged root sources; computed Sass URL expressions are not
  rebased by the AST helper. Nested partial resource resolution uses the source locations emitted by Sass.
- These are local macOS results. No AddonBone source changes or manual-playground dependencies were introduced.

## Review follow-up: Select and dependency resolution — 2026-09-15

- Removed the accidental Yarn `packageManager` field; npm and `package-lock.json` remain the repository tooling.
- Generated config imports resolve `ts-deepmerge` from addon-ui through `createRequire(import.meta.url)`.
  A real Rspack test removes consumer module search fallbacks and verifies shared/app merging. This is not
  a full pnpm or Yarn PnP environment run.
- A new component regression test reproduces the stale resize guard by interrupting propagation before
  Radix's resize listener, then pressing Escape. It fails with the old guard and passes with the new one.
  The guard now checks the original event's active dispatch phase, so a later close cannot consume it.
- A native Chrome probe observed `capture → microtask → bubble`, with `eventPhase === 2` at all three steps.
  A microtask reset would therefore expire too early for a native resize; the implementation uses `eventPhase`.
- Temporary browser diagnostics identified the outside-click flake separately: pointerdown arrived at 446.5 ms,
  while Radix's deferred document listener was installed at 447.6 ms. Replaced the raw mouse click with a locator
  click that uses Playwright's normal actionability/stability checks. No sleeps, skips or retries were added;
  temporary instrumentation was removed.
- Ten repetitions of the affected scenario pass in each browser: 20 browser checks plus two extension builds
  pass in 29.2 seconds. `npm run verify` passes 100 Jest tests (26 plugin tests), 60 tooling checks, lint,
  source/test types and declarations. Storybook builds successfully.
- The subsequent complete Chrome/Firefox matrix passes all 26 checks in 41.4 seconds, with no skips or retries.

## Radix upgrade — 2026-09-15

- npm's stable `latest` tag resolves to `radix-ui 1.6.7`; the installed Dialog is `1.1.23` and Select is `2.3.7`.
  The dependency range and root/fixture lockfiles were updated together. Component implementations are unchanged.
- Dialog now registers its title/description through React context instead of looking for them in `document`.
  The browser diagnostic exception for `DialogTitle` was removed. Console errors, warnings and page errors now
  fail browser scenarios without Radix-specific filtering.
- Modal, nested Modal and Drawer scenarios assert accessible names and descriptions inside ShadowRoot.
  All 26 build and Chrome/Firefox checks pass in 29.8 seconds, with no skips or retries.
- `npm run verify` passes: 60 tooling checks, 100 Jest tests, lint, source/test types and declarations.
  Storybook also builds successfully.
- These checks ran locally on macOS. The browser suite's popup and input limitations above still apply.
