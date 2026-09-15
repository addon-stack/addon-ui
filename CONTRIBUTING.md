# Contributing to addon-ui

## Workflow

- Create feature branches from `develop` and open pull requests back into `develop`.
- Merge the intended release changes from `develop` into `main`.
- A push to `main` runs the release workflow, which creates the version commit, tag, GitHub Release, npm publication, and
  sync back to `develop`.

## Commit messages

Use Conventional Commits:

```text
<type>(<optional scope>): <subject>
```

Mark a breaking change with `!` after the type/scope, or with a `BREAKING CHANGE:` or `BREAKING-CHANGE:` footer.

```text
refactor!: remove deprecated API

BREAKING CHANGE: Consumers must use the replacement API.
```

## Version policy

Release-it derives the next version from commit history. The highest applicable bump wins.

- Before `1.0.0`, a breaking change produces a minor release (`0.y.0`).
- Starting at `1.0.0`, a breaking change produces a major release (`x.0.0`).
- `feat` produces a minor release.
- `fix`, `perf`, `refactor`, and `ci` produce a patch release.
- `docs`, `test`, `chore`, and `build` do not produce a release on their own.

## Documentation and validation

ESLint checks and formats JavaScript, TypeScript, JSX, TSX, JSON and JSONC. Stylelint checks and formats CSS and SCSS.
Both tools fix files through the same workflow; Prettier is not used. Markdown, HTML and YAML content is not
automatically formatted. EditorConfig supplies their basic editor whitespace settings.

```sh
npm run lint          # Check code, repository naming and styles without editing
npm run format        # Apply ESLint and Stylelint fixes
npm run test:tooling  # Test lint rules, formatting and staged-file handling
npm run verify        # Lint, source/test types, tooling/component tests and declaration build
npm run test:e2e      # Extension builds and real Chromium/Firefox behavior
```

Code uses four spaces, double quotes, semicolons, LF and a 120-character line limit (URLs are exempt). JSON and styles
use two spaces. Imports are grouped with blank lines in this order: React (`react`, `react-dom` and their subpaths),
Radix (`@radix-ui/*`, `radix-ui`), other external packages and Node built-ins, internal modules, imports from the
current directory, then assets and styles. Internal modules include parent paths (`../`) and the `addon-ui` /
`#addon-ui/config` aliases. Current-directory imports (`./`, including subdirectories, and `.`) form their own group.
Assets and styles always stay in the last group, regardless of their path. Exports are sorted too.
Multiline imports and exports place the closing brace on its own line, with a trailing comma after the last specifier.
Imports from the same module are merged, with inline `type` markers for named types, using
`import-x/no-duplicates` and `@typescript-eslint/consistent-type-imports`. Imports containing only types may use
`import type`; namespace imports that cannot be combined with named imports stay separate. Side-effect stylesheet
order is preserved, and JSX keeps the React value import required by Addon Bone. Fixes are rule-based; remaining
diagnostics, including long lines and naming errors, require manual edits.
`tools/eslint/imports.mjs` adapts the duplicate-import rule to merge into a value declaration first, avoiding an
upstream autofix bug with default imports and separate named types.

The local ESLint rules enforce the naming and import boundaries described in `AGENTS.md`: component/class modules
use matching PascalCase names, hooks and utilities use kebab-case filenames, exported data constants use PascalCase,
and functions use camelCase. Shared hooks and DOM utilities cannot depend on components. Consumers use the provider
and shared-hook barrels; modules inside a hook group use sibling imports. Standard filenames, component stories and
the existing PascalCase component documentation URLs have explicit exceptions. Names and paths are never autofixed.

The pre-commit hook uses lint-staged to fix staged files and run related Jest tests. It preserves unstaged hunks and
unrelated files, and rolls fixes back if a check fails. The pre-push hook runs `npm run verify` without changing files.
CI runs the same lint rules and tooling tests as well as the component and browser suites. Generated output,
dependencies, lockfiles and the private `addon/` playground are excluded from formatting.

- Keep canonical user documentation in `docs/` in sync with public props and CSS variables.
- Update Storybook stories when a visual component change needs review.
- Before opening a pull request, run the relevant checks: `npm run lint`, `npm run typecheck`, `npm test`, and
  `npm run build:types`.

Plugin generation and package fallback checks live in `tests/plugin/` and run with
`npm run test:plugin`. They compile real JavaScript/SCSS, exercise watch
creation/edit/deletion and error recovery, and resolve fallbacks from an npm archive.
Watch fixtures use polling to avoid platform-specific native watcher limits; assertions
wait for compilation results rather than fixed delays.
