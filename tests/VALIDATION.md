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

A temporary intentional console-error probe verified that both browser projects fail on unexpected runtime errors and retain screenshots, trace and runtime diagnostics. The probe was removed after checking the reports. Normal scenarios allow the known Radix ShadowRoot title lookup diagnostic; other observed console errors and page errors fail the test.

HTML and JUnit reports are written to ignored `test-results/`; build logs and verification output are attached to the report. Fixture build statistics remain in ignored `artifacts/`. Temporary profiles are cleaned up, and the browser closes before its HTTP server to avoid waiting on speculative connections.

## Limits

These results were obtained locally on macOS with Node 24.5.0. The updated GitHub Actions jobs target Node 22 on Ubuntu; they have not been executed remotely as part of this change.

Both popup documents open in extension tabs, so the browser toolbar surface is outside this suite. Firefox popup input is dispatched through its debugging protocol because Playwright does not expose extension documents. Native Firefox touch input is not covered; composed touch-event propagation is checked in both browsers. Jest coverage describes loaded library modules and release tooling, not every component in the package.
