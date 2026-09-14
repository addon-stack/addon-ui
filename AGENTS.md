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
- `src/providers/ui/context.ts` owns portal context and resolution. Callers explicitly supply `container` and `portal`; do not infer a rendering target from Shadow DOM or content-script detection.
- Consumers import providers and their public hooks through `src/providers/index.ts`, for example `import {useComponentProps, usePortalContainer} from "../../providers"`. Do not import another provider's internal context directly; imports within that provider may use its local modules.
- Shared utilities and hooks must not import UI components. Keep internal helpers out of the public package exports unless a public API change is explicitly requested.
- When removing wrapper-only properties from a rest object, omit them during destructuring rather than deleting them afterward. Use a descriptive alias such as `container: _container`; ESLint's `ignoreRestSiblings` permits deliberate omission.
- When forwarding a property with a configuration fallback, resolve it in destructuring and pass it explicitly to the child instead of assigning to the rest object. For `container`, use `container = config?.container` on merged props so `undefined` inherits and `null` is preserved.
- Preserve user callbacks, `preventDefault`, portal priority, ref lifecycles and existing browser behavior when refactoring. Run component tests, types and lint; run the Chrome/Firefox suite for focus, layer or navigation changes.
- Automated tests and fixtures live in `tests/`. The ignored `addon/` directory is a private manual playground and must not be tracked or used by repository tests, scripts or documentation.

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
