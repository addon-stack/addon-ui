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

## Radix dependency update — 2026-09-15

- Revalidated the final source with `radix-ui@1.6.7` and its updated Radix/Floating UI dependencies.
- `npm run verify` passes: 100 Jest tests, 60 tooling checks, lint, source/test types and declarations.
- Storybook builds. The complete Chrome/Firefox matrix passes all 26 checks in 29.4 seconds,
  including Select closing/navigation, nested modal focus, Toast and isolated CSS resources.
- The npm manifest and both lockfiles retain the published framework dependency and the local automated
  fixture link. The private `addon/` playground remains ignored and is excluded from commits.

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

## AddonBone boundary integration — 2026-09-15

- Updated the root development dependency and automated fixture to published `adnbn@0.12.0`, including both
  lockfiles. The library's minimum framework peer version is now `>=0.12.0`, matching the documented
  boundary integration and excluding AddonBone 0.11.x.
- Reviewed the installed package's React render resolver, mounting lifecycle, isolation setup and target resolver.
  Render functions receive ready `container`, `target` and `boundary` values. The fixture now passes container
  and boundary directly to UIProvider, removing the ref/state/getRootNode handoff. Container factories use
  `ContentScriptContainerProps`, which describes the earlier lifecycle phase before these elements exist.
- A browser assertion verifies that the panel mounts in the framework's custom target, provider attributes reach
  the host, and the modal portal remains in the same ShadowRoot outside the React target.
- `npm run verify` passes: lint, source/test types, 60 tooling checks, 100 Jest tests and declarations.
  Fixture types and Storybook also pass. The complete build/Chrome/Firefox matrix passes all 26 checks in
  30.0 seconds, with no skips or retries and no suppressed browser runtime warnings.
- Both builds verify one framework installation for CLI/types/runtime and standard CSS isolation, WAR assets,
  lazy styles and shared popup CSS. No library runtime changes or custom stylesheet routing were required.
- Validation ran locally on macOS; the popup and input limitations recorded above still apply. Iframe isolation
  and closed ShadowRoot mode were not added to the browser matrix in this update.

- Pre-commit revalidation after the RTL commit: `npm run verify` passes again; the expanded browser matrix
  reports 29 passed and one existing Firefox document RTL skip in 34.1 seconds. The Shadow DOM RTL cases
  pass in both browsers. No additional skips or retries were introduced for the framework upgrade.

## Customization and cascade layers — 2026-09-16

- Library reset, tokens, base and component rules use the `addon-ui` sublayers. Application theme mixins
  remain unlayered. The document's body font family/size retain the documented Chrome compatibility
  exception. ScrollArea's measured content display retains one `!important`, configurable through
  `--scroll-area-content-display`.
- The automated fixture now builds both Single and Multi applications against published AddonBone 0.12.0.
  All four Chrome/Firefox build checks pass, including fixture types, emitted layers, unlayered application
  tokens and the separate lazy Tag stylesheet.
- Seven new customization scenarios pass in each browser: 14 new browser checks. They cover the reported
  shared/app TabsTrigger case, library CSS moved last, variables, application classes/layers, variants and
  states, representative former important overrides, lazy component CSS and both existing ShadowRoots.
- The complete browser rerun passes 41 scenarios in 30.5 seconds. One existing Firefox document RTL case
  remains skipped because Playwright Juggler does not expose extension documents. There are no new skips
  or retries; all customization popup cases run in Firefox through RDP.
- Final `npm run verify` passes: lint, source/test types, 60 tooling checks, 100 Jest tests in nine suites
  and declaration generation. `git diff --check` passes. The subsequent documentation changes do not
  alter library or fixture runtime code; the browser results above are from the step-five implementation.
- `npm pack --dry-run --ignore-scripts` lists 365 files, includes `src/styles/layers.scss`, and excludes
  automated tests and the private manual extension. No package was published.
- These are local macOS results. Popup pages run in extension tabs, and the customization probes use DOM
  events and native computed styles. Firefox popup evaluation exceptions are checked through RDP; those
  pages do not have Playwright console monitoring. No remote CI run or toolbar-popup test is claimed.

## Preparation for automatic stylesheet delivery — 2026-09-16

- Removed isolation query suffixes from library, Storybook, virtual-style and fixture imports, along with
  their dedicated type declarations and Jest mapping. Documentation examples now use ordinary imports.
- `npm run verify` passes: lint, source/test types, 60 tooling checks, 100 Jest tests and declarations.
- All four integration builds compile with the still-installed AddonBone 0.12.0, but their delivery
  assertions fail: the old framework emits UI styles into manifest `content_scripts[].css` instead of
  routing them into ShadowRoots. The assertions remain intact; no browser pass is claimed for this state.
- Upgrade the fixture to the forthcoming automatic-delivery framework version and rerun integration and
  browser checks before release. The preceding passing browser results describe the earlier imports.

## AddonBone 0.13.0 automatic stylesheet delivery — 2026-09-17

- Installed published `adnbn@0.13.0` in the root and automated extension fixture, updating both lockfiles.
  The minimum framework peer version is now `>=0.13.0`, matching the ordinary stylesheet imports.
- Updated the build verifier from the removed isolation loader/layer identity to the installed
  `adnbn-default-modules` loader and `adnbn:css:default` layer. Manifest isolation, CSS/WAR resources,
  shared popup styles, dependency resolution and lazy stylesheet assertions remain enabled.
- `npm run verify` passes: lint, source/test types, 60 tooling checks, 111 Jest tests in ten suites
  and declaration generation. Storybook builds successfully.
- The full `npm run test:e2e` passes 49 checks in 42.5 seconds: four extension builds and 45 browser
  scenarios. One existing Firefox document RTL case remains skipped because Playwright Juggler does
  not expose extension documents. No new skips, retries or runtime warning filters were added.
- Both browsers verify automatic CSS delivery into two ShadowRoots and extension popup documents,
  initial/lazy styles, theme variables, shared/app customization and application layer precedence.
  Existing focus, scroll, Select, Toast and SVG icon mode scenarios also pass.
- These local macOS results supersede the preceding AddonBone 0.12.0 delivery failures. Firefox
  popup checks use RDP; the documented toolbar-popup and console-monitoring limits still apply.

## Icon modes — initial run before the AddonBone 0.13 upgrade (superseded)

- `IconMode` and literal modes are checked as a discriminated union, including
  invalid mixed fields held in variables (`tests/types/icons.tsx`).
- `npm run verify`: lint, source/test types, 60 tooling tests, 111 Jest tests and
  declaration generation passed. The icon component suite covers component shorthand,
  memo components, custom viewBox, independent inline state, mode changes, SVG
  refs/callbacks, config replacement and the missing-name fallback. The real
  compiler suite verifies whole-entry shared/app icon replacement while other
  config values retain deep/array merge behavior.
- Storybook production build passed.
- Rebuilt the Single fixture for Chrome and Firefox and checked fixture types.
  `npm run test:e2e -- tests/e2e/icons.spec.mjs --no-deps`: **4 passed**. Both
  browsers render real SVG-file imports in sprite/inline/asset modes in two
  ShadowRoots and an extension page. Checks cover source viewBox, per-instance
  colors, lazy fixture CSS, portal references, asset decoding and mode changes.
  Firefox extension-page checks use the existing RDP helper.
- Asset URLs must use regular `.svg` imports here. The `?browser` query in the
  installed AddonBone 0.12 emits a CSS-localization extension-ID placeholder that
  remains unresolved when used as a JavaScript URL.
- At that point the full integration gate failed: all four build checks stopped
  on nonempty `manifest.content_scripts[0].css` with AddonBone 0.12.0. The focused
  icon fixture still used an isolation query. These historical results are superseded
  by the AddonBone 0.13 upgrade above and the final regression run below.


## Icon review fixes — 2026-09-17

- Published AddonBone 0.13.0 is installed in both the package and the automated fixture.
  The last icon stylesheet isolation query and its ambient declaration are removed;
  all fixture styles use automatic framework delivery.
- Icon contracts and normalization now live in `Icon/definition`, without runtime
  dependencies on components, providers or SCSS. A real development Rspack build
  with side-effect pruning and used-export optimization disabled checks module stats.
  Eleven lint cases guard this leaf, including type imports, re-exports, dynamic imports
  and stylesheet imports. `getIconDefinition` is no longer a public package export.
- Red/green evidence: the new component test first failed because a sprite descriptor
  changed the handwritten source viewBox from `0 0 80 20` to `0 0 24 24`. It passes
  after forwarding viewBox only when explicitly supplied.
- Real SVG-file fixtures cover a viewBox-only source and a source with matching fixed
  width/height/viewBox. The actual framework loader strips the latter's redundant viewBox
  and retains dimensions. Pixel samples confirm explicit descriptor metadata scales the
  fixed source to 40x10 in both sprite and inline modes.
- With the original `display: none` sprite, Chromium's new pixel checks failed in both
  ShadowRoot and extension document: gradient samples were white and clip/mask corners
  were incorrectly filled. Firefox passed the same cases. Both browsers pass after
  switching to an absolutely positioned, zero-size sprite with hidden overflow.
- Pixel checks sample gradient endpoints, clip/mask centers and corners with a channel
  tolerance of 12. PNG screenshots are decoded through Image and OffscreenCanvas without
  an added dependency. Firefox's RDP screenshot actor captures actual extension documents;
  these checks do not substitute an HTML copy or add an extension-document skip.
- `npm run verify` passes: lint, source/test typechecks, 71 tooling tests, 113 Jest tests
  in eleven suites, and declaration generation. Storybook production build passes.
- Full `npm run test:e2e`: **55 passed, 1 existing skip** in 46.6 seconds, including all
  four extension builds and the ten icon scenarios. The skip remains Firefox document
  RTL; no skips or retries were added for icons. CSS delivery, lazy styles, customization,
  focus, scrolling, Select and Toast checks also pass.
- README and Icon/SvgSprite documentation cover the current modes, fixed-size SVG metadata,
  asset URL handling, props and CSS-variable tables. Local screenshot output is ignored.
- These are local macOS results. Firefox popup interactions and screenshots use RDP;
  its existing console-monitoring and toolbar-popup limitations remain. ID namespacing,
  registration-context optimization and SVGR dimensions normalization remain follow-ups.

## Icon registration and symbol IDs — 2026-09-17

- Completed the registration-context and symbol-ID follow-ups above. The internal
  registry is stable across name registrations; public `useIcons` retains its contract.
  Immutable Sets deduplicate names, while the public array retains insertion order.
  UIProvider empty defaults and theme/extra context values are stable across unchanged
  parent renders; memoized SvgSymbol instances preserve unchanged source renders.
- Provider symbol prefixes use 128 random bits from crypto.getRandomValues, generated
  once per mounted provider. Names are encoded by Unicode code point, including `_`;
  tests fix the emoji encoding and distinguish literal escape-like strings from spaces.
  Standalone SvgSprite retains raw IDs and supports an explicit resolver.
- Profiler tests verify that registering B and mounting B through a parent update do not
  update the A list or rerender its symbol. Replacement sources, component size defaults
  and theme changes still update consumers; duplicate registration keeps the public
  names array unchanged.
- The package root explicitly enumerates provider exports. A TypeScript checker test
  snapshots all 180 root exports and the four config exports, including erased types.
  `Icons` is available from the root only; the internal registry hook is not package API.
- Four new Chrome/Firefox scenarios check nested/sibling providers, application elements
  with matching IDs, Unicode/percent/space names, portals and stable IDs across updates.
  Both ShadowRoots and real extension documents are covered, including pixel checks and
  Firefox RDP screenshots. Existing gradient, clipping, masking and mode tests still pass.
- `npm run verify` passes: lint, source/test types, 72 tooling tests, 119 Jest tests in
  twelve suites and declaration generation. Storybook production build passes.
- Full `npm run test:e2e`: **59 passed, 1 existing Firefox document RTL skip** in 50.8s,
  including all four extension builds. No new skips, retries or warning filters.
- These local macOS checks retain the previously documented Firefox console-monitoring
  and toolbar-popup limits. Internal gradient/mask IDs are not rewritten; the AddonBone
  opt-in for size normalization remains a separate framework task. No version was bumped.


## Icon module layout — 2026-09-17

- Supersedes the earlier definition-leaf layout: `types.ts` and `utils.ts`
  now sit beside `Icon.tsx`. Consumers import their exports through `Icon/index.ts`;
  Icon itself uses sibling imports. The obsolete leaf-only lint rule was removed.
- `getIconDefinition` is intentionally exported from the package root. The TypeScript
  API snapshot now includes 181 root exports and the unchanged four config exports.
- A production Rspack regression test imports IconMode and getIconDefinition from the
  root entry. Chunk module stats contain only the consumer and those two source modules;
  no UI components or CSS are emitted. The unoptimized config-entry test also passes.
- `npm run verify` passes: lint, source/test types, 61 tooling tests, 120 Jest tests in
  twelve suites and declarations. Storybook production build passes. The browser suite
  was not repeated for this module relocation; its previous result is recorded above.
