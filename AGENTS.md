# Repository conventions

## Naming

- Files implementing a React component or a class use PascalCase and match the primary exported symbol: `Select.tsx`, `ToastFocusRestore.tsx`, `ThemeStorage.ts`.
- Directories representing a component or class also use PascalCase: `components/Select/`, `components/Toast/`.
- Hooks, utilities, test helpers and other function modules use kebab-case filenames: `use-floating-focus.ts`, `use-select-navigation.ts`, `verify-build.mjs`, `floating-focus.test.tsx`.
- Hook and function symbols keep normal TypeScript naming: `useFloatingFocus`, `getActiveElement`. The kebab-case rule applies to filenames.
- Module-level data constants exported for reuse across files use PascalCase: `DialogPropsKeys`, `ModalPropsKeys`, `DrawerPropsKeys`, `ViewPropsKeys`, `HideInTable`. Keep this spelling in declarations, index exports, imports and usages. This rule applies to constant identifiers; hooks and functions keep camelCase even when declared with `const`.
- Organizational directories use kebab-case: `hooks/floating/`, `utils/dom/`, `tests/support/`. Conventional entry and configuration filenames keep their expected names.
- Keep a component or class in its own module when a file would otherwise mix it with standalone hooks or utilities.
- TSX components include the React import required by the current AddonBone JSX transform, even when TypeScript or Jest uses the automatic JSX runtime.

## Responsibilities and dependencies

- `src/utils/dom/` contains DOM operations without React state, context or lifecycle subscriptions.
- `src/hooks/floating/` owns shared layer registration, nesting, stacking and focus behavior. Keep layer management separate from focus handling; register layers within their `ownerDocument`.
- Shared hook groups expose their consumer API through an `index.ts`. Components and tests import from the group directory, for example `../../hooks/floating`, rather than individual hook files. Modules inside the group use direct sibling imports to avoid cycles through their own index; registry internals stay private to the group.
- Component-specific behavior stays inside that component's directory, including Select navigation and Toast viewport handling.
- Component types and helpers live alongside their component and are exported through its index when needed by consumers. Icon keeps `types.ts` and `utils.ts` beside `Icon.tsx`; other modules import them through `components/Icon`, while Icon uses direct sibling imports.
- `src/providers/ui/context.ts` owns portal context and resolution. Callers explicitly supply `container` and `portal`; do not infer a rendering target from Shadow DOM or content-script detection.
- Consumers import providers and their public hooks through `src/providers/index.ts`, for example `import {useComponentProps, usePortalContainer} from "../../providers"`. Do not import another provider's internal context directly; imports within that provider may use its local modules.
- The package root explicitly lists provider exports. Internal consumer hooks such as `useIconRegistry` may be available through the provider index without becoming package API. Update `tests/fixtures/public-exports.json` only for intentional public API changes; its TypeScript-based check covers values and types.
- Shared utilities and hooks must not import UI components. Keep internal helpers out of the public package exports unless a public API change is explicitly requested.
- When removing wrapper-only properties from a rest object, omit them during destructuring rather than deleting them afterward. Use a descriptive alias such as `container: _container`; ESLint's `ignoreRestSiblings` permits deliberate omission.
- When forwarding a property with a configuration fallback, resolve it in destructuring and pass it explicitly to the child instead of assigning to the rest object. For `container`, use `container = config?.container` on merged props so `undefined` inherits and `null` is preserved.
- Preserve user callbacks, `preventDefault`, portal priority, ref lifecycles and existing browser behavior when refactoring. Run component tests, types and lint; run the Chrome/Firefox suite for focus, layer or navigation changes.
- Automated tests and fixtures live in `tests/`. The ignored `addon/` directory is a private manual playground and must not be tracked or used by repository tests, scripts or documentation.

## Customization contract

- Maximum customization is a core library requirement. Treat the library's visual styles as overridable defaults and preserve the public component options, callbacks, refs and styling hooks that applications use to customize behavior and appearance.
- CSS custom properties are the primary theming API. Preserve their inheritance, documented names and fallback behavior, including application-wide themes and per-component overrides.
- Put library-owned rules in the declared `addon-ui.reset`, `addon-ui.tokens`, `addon-ui.base` or `addon-ui.components` layer and load the shared layer ordering from `src/styles/layers.scss`. Application theme mixins and generated override styles stay unlayered unless the application explicitly chooses a layer. Preserve the documented unlayered document typography exception; do not expand it to component styles.
- Application styles supplied through `className` and supported slot class names must be able to override the library's visual defaults without requiring `!important`, duplicated selectors or knowledge of generated CSS Module names. Do not rely on class order in the HTML attribute to establish CSS precedence.
- Keep library defaults and application overrides distinct when composing styles. The plugin must preserve application theme precedence; shared theme defaults must precede app-specific overrides. Verify the resulting cascade across initial and lazy-loaded CSS, rather than assuming JavaScript import order guarantees it.
- Avoid `!important`, unnecessarily specific selectors and non-overridable inline presentation styles. Where runtime positioning, measurement or a third-party primitive requires a constraint, keep it narrowly scoped and provide an explicit supported customization path where feasible.
- Customization must work in extension pages and isolated content-script UIs. Application overrides and library styles must reach the same document or ShadowRoot; CSS variables must be applied to the appropriate root or host.
- Changes to style composition, specificity or delivery require representative browser checks for CSS-variable overrides, custom classes, variants and states, and lazy-loaded components. Preserve default appearance while making application overrides predictable.

## Tooling

- Run `npm run format` for ESLint/Stylelint autofixes and `npm run lint` for checks without writes. Do not add Prettier.
- Keep custom ESLint rules in `tools/eslint/` and their regression tests in `tests/tooling/`.
- Separate imports into groups: React (`react`, `react-dom` and subpaths), Radix (`@radix-ui/*`, `radix-ui`), other external packages and Node built-ins, internal modules, current-directory imports (`./`, including subdirectories, and `.`), then assets/styles. Treat `addon-ui` and `#addon-ui/config` as internal aliases; parent paths (`../`) stay in the internal group. Assets/styles always belong to the last group, regardless of path.
- Merge named type and value imports from the same module, marking types inline (`import {type Props, Root} from "package"`). Type-only imports may use `import type`; keep namespace imports separate where syntax requires it.
- Multiline imports and exports put the closing brace on its own line and use a trailing comma after the last specifier.
- Component stories, conventional configuration names and existing PascalCase documentation URLs are naming exceptions.
- Preserve side-effect stylesheet order, required React value imports and runtime behavior during formatting changes.
- Pre-commit operates only on staged files through lint-staged; pre-push runs `npm run verify` without autofixing.

<!-- codebase-memory-mcp:start -->

# Codebase Knowledge Graph (codebase-memory-mcp)

This project uses codebase-memory-mcp to maintain a knowledge graph of the codebase.
ALWAYS prefer MCP graph tools over grep/glob/file-search for code discovery.

## Priority Order

1. `search_graph` — find functions, classes, routes, variables by pattern
2. `trace_path` — trace who calls a function or what it calls
3. `get_code_snippet` — read specific function/class source code
4. `query_graph` — run Cypher queries for complex patterns
5. `get_architecture` — high-level project summary

## When to fall back to grep/glob

- Searching for string literals, error messages, config values
- Searching non-code files (Dockerfiles, shell scripts, configs)
- When MCP tools return insufficient results

## Examples

- Find a handler: `search_graph(name_pattern=".*OrderHandler.*")`
- Who calls it: `trace_path(function_name="OrderHandler", direction="inbound")`
- Read source: `get_code_snippet(qualified_name="pkg/orders.OrderHandler")`

<!-- codebase-memory-mcp:end -->
