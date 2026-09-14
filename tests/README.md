# Testing

All automated checks and their inputs live in this directory. The fixture is a private npm package committed with its lockfile; it uses the current library source and the published AddonBone dependency. It has no dependency on a sibling checkout or a developer's manual extension.

## Layout

| Directory              | Responsibility                                                                                | Runner                                     |
| ---------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `unit/`                | Release tooling in Node                                                                       | Jest `unit` project                        |
| `components/`          | Real React/Radix wrappers: portal resolution, pending containers and focus lifecycle          | Jest `components` project, jsdom           |
| `integration/`         | Extension builds, dependency resolution, isolated CSS, WAR and declarations                   | Playwright `build` project                 |
| `e2e/`                 | Styles, dialogs, Select, Toast and popup behavior in installed extensions                     | Playwright `chrome` and `firefox` projects |
| `fixtures/shadow-dom/` | Extension source, configuration and locked dependencies used by integration and browser tests | AddonBone                                  |
| `fixtures/sites/`      | External website documents used by browser tests                                              | Local HTTP server                          |
| `support/`             | Shared environment setup, build verification and browser fixtures                             | Imported by tests                          |

Keep assertions in the suite that owns the behavior. Shared helpers provide setup and teardown; they do not replace real components with simplified implementations. Name Jest tests `*.test.cjs` or `*.test.tsx` in their respective directories, and build/browser tests `*.spec.mjs`.

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
| `npm test`                 | Both Jest projects                                            |
| `npm run test:unit`        | Node tests only                                               |
| `npm run test:components`  | jsdom component tests only                                    |
| `npm run test:ci`          | Both Jest projects with coverage                              |
| `npm run typecheck:tests`  | Component test and setup types                                |
| `npm run test:integration` | Both extension builds and their assertions; no browser launch |
| `npm run test:e2e`         | Build dependencies, then all Chrome and Firefox scenarios     |
| `npm run test:all`         | Jest, integration and browser checks                          |
| `npm run test:report`      | Last Playwright HTML report                                   |

For a focused rerun against existing, current builds:

```sh
npm run test:components -- --runTestsByPath tests/components/toast.test.tsx
npm run test:e2e -- --project=chrome --grep 'Toast' --no-deps
```

Omit `--no-deps` after changing the library or fixture. Browser tests fail if an expected build is missing; they never fall back to another extension directory.

## Execution and diagnostics

Jest and Playwright each default to two workers. The build project runs sequentially because both browser targets share the fixture's generated-module directory. Each target is built once per Playwright invocation, then reused by its browser scenarios. A worker owns one temporary browser profile and local HTTP server; each scenario opens a fresh document and closes its pages after diagnostics. No browser scenario depends on a preceding scenario's UI state. Use the runner's `--workers` option to reduce concurrency when necessary.

Playwright reports every scenario separately, without automatic retries. Failures retain screenshots and a trace; every scenario attaches runtime diagnostics, and build tests attach compiler output and verification results. HTML/JUnit reports and traces go to ignored `test-results/`. Rspack statistics stay in the fixture's ignored `artifacts/` directory. Temporary browser profiles are removed during teardown.

CI runs Jest, lint, types and declarations in one job, and the two-browser suite in a separate job. Coverage and browser diagnostics are uploaded independently.

## Scope of evidence

jsdom tests exercise the real wrappers and Radix, while stubbing stylesheet imports, framework/storage boundaries and unsupported layout APIs. They do not prove native scrolling, CSS cascade or browser focus behavior; the extension tests cover those.

Both browser projects install and run the actual emitted extension. Chrome uses native Playwright input, including in the popup document. Firefox content-script tests also use native input. Playwright does not expose Firefox extension documents, so the Firefox popup helper uses its local debugging protocol and DOM events. Both popup documents open in extension tabs; these checks do not exercise the browser toolbar surface. Native touch scrolling is checked in Chrome; Firefox checks composed touch-event propagation only.

The known Radix ShadowRoot title lookup diagnostic is permitted in browser logs; any other console error or page error fails the scenario. See [the fixture](./fixtures/shadow-dom/README.md) for CSS delivery details and [recorded validation](./VALIDATION.md) for the latest local results.
