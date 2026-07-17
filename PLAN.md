# Implementation Plan: `solid-ui-next`

## 1. Objective

Create a public MIT-licensed monorepo named:

```text
solid-ui-next
```

The repository is an experimental playground for:

- Astro 7.1
- Solid 2 beta
- Future Solid 2-compatible Kobalte and Corvu experiments
- The future Solid UI v1/demo site
- A future `packages/cli`, which is explicitly out of scope for this initial implementation

The immediate goal is to prove that Astro can:

- server-render Solid 2 components
- hydrate Solid 2 components
- support every built-in Astro hydration directive
- build a fully static site
- pass real Chromium browser tests against the production build

This is not intended to become a maintained Astro integration fork. The private integration package is disposable playground infrastructure.

---

# 2. Non-goals

Do not implement any of the following:

- `packages/cli`
- Solid UI components
- Kobalte or Corvu integration
- release tooling
- Changesets
- package publishing
- Git hooks
- GitHub Actions or other CI
- dependency update automation
- SSR deployment adapters
- an abstraction for switching between the fork and the future official integration
- automated synchronization with Astro upstream
- support for Solid 1
- multiple browser engines
- Devtools compatibility work
- performance benchmarking
- custom Astro hydration directives

When Astro officially supports Solid 2, the repository owner will manually replace the integration import.

---

# 3. Locked technical decisions

Use:

```text
Node.js 24
pnpm 11
pnpm workspaces
Turborepo
Astro static output
Solid 2 beta
TypeScript
Tailwind CSS 4
Oxlint
Oxfmt
Astro Check
Vitest
happy-dom
Playwright
Chromium only
```

Repository rules:

- The repository is public.
- Add an MIT license.
- All workspace packages must have `"private": true`.
- Do not add publishing metadata.
- Do not add a Node version file.
- Enforce Node 24 through `package.json#engines`.
- Do not use pnpm catalogs.
- Put exact versions directly into each `package.json`.
- Do not use semver ranges for the Solid beta toolchain.
- Do not add ESLint, Prettier, or Biome.
- Use one root TypeScript configuration.
- Use one root Oxlint configuration.
- Use one root Oxfmt configuration.
- Add package-level configuration only where a package requires an extension or framework-specific setting.
- Use package imports and app-local `@/*` aliases.
- Co-locate unit tests with source files.
- Put Playwright tests under `tests/e2e`.

Astro 7.1.0 is the current exact Astro baseline. It uses Vite 8.0.13 and requires Node 22.12 or newer, so Node 24 is appropriate.

---

# 4. Core version baseline

Pin these exact compatibility-sensitive versions:

```text
astro                     7.1.0
vite                      8.0.13
solid-js                  2.0.0-beta.19
@solidjs/web              2.0.0-beta.19
vite-plugin-solid         3.0.0-next.12
@astrojs/check            0.9.9
```

The official Astro Solid integration is currently version 7.0.1, depends on the Solid 1-compatible `vite-plugin-solid` 2.x line, and declares `solid-js ^1.9.13`.

Solid 2 moves the DOM runtime to `@solidjs/web`, exports store helpers from `solid-js`, changes the JSX import source to `@solidjs/web`, and replaces `Suspense` with `Loading`.

Pin these repository tools to their exact current versions when initializing:

```text
pnpm                      11.13.1
turbo                     2.10.5
oxlint                    1.74.0
oxfmt                     0.59.0
vitest                    4.1.10
happy-dom                 20.10.6
@playwright/test          1.61.1
tailwindcss               4.3.3
@tailwindcss/vite         4.3.3
```

pnpm 11.13.1, Turborepo 2.10.5, Oxlint 1.74.0, Oxfmt 0.59.0, and Playwright 1.61.1 are the current baselines for this plan.

Use TypeScript:

```text
typescript                6.0.3
```

Do not move this playground to TypeScript 7 during initial setup. Astro 7.1.0 itself is tested internally with TypeScript 6.0.3, making that the more conservative compatibility baseline.

All versions must be exact strings without `^`, `~`, `latest`, `next`, or workspace catalogs.

The only workspace version specifier should be:

```json
"@solid-ui/astro-solid2": "workspace:*"
```

---

# 5. Target repository structure

Create this structure:

```text
solid-ui-next/
├─ .vscode/
│  ├─ extensions.json
│  └─ settings.json
│
├─ apps/
│  └─ docs/
│     ├─ public/
│     ├─ src/
│     │  ├─ components/
│     │  │  ├─ ClientIdleCounter.test.tsx
│     │  │  ├─ ClientIdleCounter.tsx
│     │  │  ├─ ClientLoadCounter.test.tsx
│     │  │  ├─ ClientLoadCounter.tsx
│     │  │  ├─ ClientMediaCounter.test.tsx
│     │  │  ├─ ClientMediaCounter.tsx
│     │  │  ├─ ClientOnlyCounter.test.tsx
│     │  │  ├─ ClientOnlyCounter.tsx
│     │  │  ├─ ClientVisibleCounter.test.tsx
│     │  │  ├─ ClientVisibleCounter.tsx
│     │  │  ├─ ServerCounter.test.tsx
│     │  │  └─ ServerCounter.tsx
│     │  ├─ pages/
│     │  │  └─ index.astro
│     │  ├─ styles/
│     │  │  └─ global.css
│     │  └─ env.d.ts
│     ├─ astro.config.ts
│     ├─ package.json
│     └─ tsconfig.json
│
├─ packages/
│  └─ astro-solid2/
│     ├─ src/
│     │  ├─ client.ts
│     │  ├─ container-renderer.test.ts
│     │  ├─ container-renderer.ts
│     │  ├─ context.ts
│     │  ├─ index.test.ts
│     │  ├─ index.ts
│     │  ├─ server.ts
│     │  └─ types.ts
│     ├─ package.json
│     ├─ README.md
│     └─ tsconfig.json
│
├─ tests/
│  └─ e2e/
│     └─ hydration.spec.ts
│
├─ .gitignore
├─ LICENSE
├─ README.md
├─ oxfmt.config.ts
├─ oxlint.config.ts
├─ package.json
├─ playwright.config.ts
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ tsconfig.json
├─ turbo.json
└─ vitest.config.ts
```

Do not add empty placeholder packages.

---

# 6. Initialize the root workspace

Create the root `package.json` with:

```json
{
  "name": "solid-ui-next",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.13.1",
  "engines": {
    "node": ">=24 <25",
    "pnpm": "11.13.1"
  },
  "scripts": {
    "build": "turbo run build",
    "check": "turbo run check",
    "dev": "turbo run dev",
    "format": "oxfmt .",
    "format:check": "oxfmt --check .",
    "lint": "oxlint .",
    "lint:fix": "oxlint . --fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "pnpm build && playwright test",
    "validate": "pnpm format:check && pnpm lint && pnpm check && pnpm test && pnpm build && pnpm test:e2e"
  }
}
```

Add the exact root development dependencies required for:

- Turborepo
- TypeScript
- Oxlint
- Oxfmt
- Vitest
- happy-dom
- Playwright
- the Solid Vite plugin used by Vitest
- Solid 2
- `@solidjs/web`

Do not install Astro at the root unless a root-level tool directly requires it.

Create:

```yaml
# pnpm-workspace.yaml

packages:
  - "apps/*"
  - "packages/*"
```

Do not use a `catalog` or `catalogs` section.

---

# 7. Configure Turborepo

Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "check": {
      "dependsOn": ["^check"],
      "outputs": []
    }
  }
}
```

Do not route root linting, formatting, Vitest, or Playwright through Turborepo. Those commands already operate across the repository from the root.

The integration package has no build step because it is consumed directly from TypeScript source.

---

# 8. Global TypeScript configuration

Create one strict root `tsconfig.json`.

Required compiler behavior:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "jsxImportSource": "@solidjs/web",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "playwright-report",
    "test-results",
    ".astro",
    ".turbo"
  ]
}
```

Solid 2 web projects must use:

```json
"jsxImportSource": "@solidjs/web"
```

because the JSX runtime and JSX types are no longer owned by `solid-js`.

## Package TypeScript config

`packages/astro-solid2/tsconfig.json` should contain only:

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*.ts"]
}
```

## Docs TypeScript config

`apps/docs/tsconfig.json` should extend the root and add only Astro/app-specific settings:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["astro/client"]
  },
  "include": [".astro/types.d.ts", "src/**/*", "astro.config.ts"]
}
```

Also create:

```ts
/// <reference types="astro/client" />
```

in `apps/docs/src/env.d.ts`.

---

# 9. Configure Oxlint

Create one root `oxlint.config.ts`.

Use the native TypeScript configuration format:

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
    pedantic: "off",
    style: "off",
    restriction: "off",
    nursery: "off",
  },
  plugins: ["typescript", "unicorn", "import", "vitest", "oxc"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.astro/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/playwright-report/**",
    "**/test-results/**",
  ],
  overrides: [
    {
      files: ["**/*.test.{ts,tsx}", "tests/**/*.ts"],
      env: {
        browser: true,
        node: true,
      },
    },
    {
      files: ["**/*.astro"],
      rules: {
        "no-unused-vars": "off",
      },
    },
  ],
});
```

Do not enable Oxlint’s experimental TypeScript compiler diagnostics. `tsc` and `astro check` remain authoritative for type errors.

Oxlint can inspect JavaScript and TypeScript inside `.astro` script blocks, but it does not fully parse Astro template syntax. Template-aware correctness therefore remains the responsibility of `astro check`.

---

# 10. Configure Oxfmt

Create one root `oxfmt.config.ts`:

```ts
import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  sortImports: true,
  sortPackageJson: {
    sortScripts: true,
  },
  sortTailwindcss: {
    stylesheet: "./apps/docs/src/styles/global.css",
  },
  ignorePatterns: [
    "**/*.astro",
    "**/node_modules/**",
    "**/dist/**",
    "**/.astro/**",
    "**/.turbo/**",
    "**/coverage/**",
    "**/playwright-report/**",
    "**/test-results/**",
    "pnpm-lock.yaml",
  ],
});
```

Oxfmt supports import sorting, package JSON sorting, Tailwind class sorting, and repository-level ignore patterns. Tailwind 4 sorting can reference the global stylesheet.

Explicitly ignore `.astro` files until Oxfmt provides complete Astro formatting support.

The Astro VS Code extension should format `.astro` files.

---

# 11. Editor configuration

Create `.vscode/extensions.json`:

```json
{
  "recommendations": ["astro-build.astro-vscode", "oxc.oxc-vscode", "bradlc.vscode-tailwindcss"]
}
```

The official Astro extension provides Astro syntax highlighting, TypeScript information, completions, and Astro-aware editing.

The Oxc extension handles both Oxlint and Oxfmt and uses the extension identifier `oxc.oxc-vscode`.

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.format.oxc": "explicit",
    "source.fixAll.oxc": "explicit"
  },
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "oxc.oxc-vscode"
  },
  "oxc.requireConfig": true
}
```

---

# 12. Create the private Astro Solid 2 integration

Create:

```text
packages/astro-solid2
```

Package name:

```text
@solid-ui/astro-solid2
```

## Package manifest

Create `packages/astro-solid2/package.json`:

```json
{
  "name": "@solid-ui/astro-solid2",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./container-renderer": "./src/container-renderer.ts",
    "./client.js": "./src/client.ts",
    "./server.js": "./src/server.ts",
    "./package.json": "./package.json"
  },
  "scripts": {
    "check": "tsc --noEmit"
  },
  "dependencies": {
    "vite": "8.0.13",
    "vite-plugin-solid": "3.0.0-next.12"
  },
  "peerDependencies": {
    "astro": "7.1.0",
    "solid-js": "2.0.0-beta.19",
    "@solidjs/web": "2.0.0-beta.19"
  },
  "devDependencies": {
    "astro": "7.1.0",
    "solid-js": "2.0.0-beta.19",
    "@solidjs/web": "2.0.0-beta.19",
    "typescript": "6.0.3"
  }
}
```

Do not add:

- `files`
- `publishConfig`
- release scripts
- a build script
- generated declarations
- `dist`
- Changesets

The exports intentionally point directly to TypeScript source.

---

# 13. Copy the official integration source

Use the Astro 7.1-era official Solid integration as the starting point.

Copy these files from Astro’s current Solid integration:

```text
client.ts
container-renderer.ts
context.ts
index.ts
server.ts
types.ts
```

Do not copy:

- package release tooling
- Astro monorepo build scripts
- upstream test fixtures
- Changesets
- Astro internal scripts
- generated output

The official integration is thin: it registers a Vite plugin, installs a renderer, exposes client/server entrypoints, handles Solid slots, and performs server rendering and client hydration.

---

# 14. Required integration modifications

Keep the official implementation unchanged unless a change is required for:

- Solid 2
- the private package name
- direct TypeScript source consumption

Do not refactor unrelated code.

## 14.1 `client.ts`

Replace:

```ts
import { Suspense } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { createComponent, hydrate, render } from "solid-js/web";
```

with:

```ts
import { Loading, createStore, reconcile } from "solid-js";
import { createComponent, hydrate, render } from "@solidjs/web";
```

Replace:

```ts
createComponent(Suspense, ...)
```

with:

```ts
createComponent(Loading, ...)
```

Preserve the existing logic for:

- `client:only`
- hydration versus client rendering
- slot extraction
- named slots
- default children
- `data-solid-render-id`
- repeated prop updates
- `astro:unmount`
- the existing WeakMap
- returned disposer handling

Do not add new lifecycle abstractions during the initial port.

The current official client renderer imports stores from `solid-js/store`, the DOM runtime from `solid-js/web`, and wraps hydrated output in `Suspense`; those are the exact Solid 2 migration points.

## 14.2 `server.ts`

Replace the Solid import source:

```ts
from "solid-js/web"
```

with:

```ts
from "@solidjs/web"
```

Replace the imported `Suspense` symbol with `Loading`.

Replace both server-side uses of:

```ts
createComponent(Suspense, ...)
```

with:

```ts
createComponent(Loading, ...)
```

Preserve:

- `generateHydrationScript`
- `NoHydration`
- `renderToString`
- `renderToStringAsync`
- `ssr`
- the sync renderer check
- slot name normalization
- static slot behavior
- render IDs
- `noScripts`
- `supportsAstroStaticSlot`
- renderer detection

Do not replace `renderToStringAsync` with streaming during this implementation.

The official server renderer currently uses Solid 1 web imports and `Suspense` wrappers around hydratable and static async output.

## 14.3 `container-renderer.ts`

Preserve the official renderer identity:

```ts
name: "@astrojs/solid-js";
```

This preserves Astro’s expected Solid renderer hint:

```astro
client:only="solid-js"
```

Change only the package entrypoints:

```ts
clientEntrypoint: "@solid-ui/astro-solid2/client.js",
serverEntrypoint: "@solid-ui/astro-solid2/server.js",
```

The official container renderer currently points its client and server entrypoints to `@astrojs/solid-js`; only those package references should change.

## 14.4 `index.ts`

Preserve the integration identity:

```ts
name: "@astrojs/solid-js";
```

This is intentional even though the package is named:

```text
@solid-ui/astro-solid2
```

Update the Vite environment dependency optimization entries:

```ts
include:
  environmentName === "client"
    ? ["@solid-ui/astro-solid2/client.js"]
    : [],

exclude: ["@solid-ui/astro-solid2/server.js"],
```

Retain:

```ts
solid({
  include,
  exclude,
  ssr: true,
});
```

Retain Astro’s environment configuration plugin.

Keep Devtools support structurally present if it exists in the copied source, but:

- do not add `solid-devtools`
- do not test it
- configure the docs application with `devtools: false`
- document it as unsupported in this playground

Update user-facing package names in warning strings and deprecation messages to:

```text
@solid-ui/astro-solid2
```

Do not alter the Astro renderer detection logic.

The current integration registers `vite-plugin-solid`, adds the renderer, and configures client/server dependency optimization through Vite environment hooks.

## 14.5 Internal imports

Because the package exposes source TypeScript directly, internal imports must resolve without a build step.

Prefer extensionless relative imports:

```ts
import { getContext } from "./context";
```

rather than copied build-oriented imports such as:

```ts
import { getContext } from "./context.js";
```

Apply this consistently across the private package.

Do not expose internal files through additional package exports unless Astro needs them.

---

# 15. Integration smoke tests

Create co-located Vitest tests.

## `container-renderer.test.ts`

Verify:

```text
name             === "@astrojs/solid-js"
clientEntrypoint === "@solid-ui/astro-solid2/client.js"
serverEntrypoint === "@solid-ui/astro-solid2/server.js"
```

## `index.test.ts`

Call the default integration factory and verify:

- the returned value has an integration name
- the integration name is `@astrojs/solid-js`
- `hooks["astro:config:setup"]` exists
- `hooks["astro:config:done"]` exists
- calling the factory without options does not throw

Do not deeply mock Astro internals.

The production Astro build and Playwright suite are the authoritative integration tests.

---

# 16. Create `apps/docs`

Package name:

```text
docs
```

Create `apps/docs/package.json`:

```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "astro build",
    "check": "astro check",
    "dev": "astro dev",
    "preview": "astro preview"
  },
  "dependencies": {
    "@solid-ui/astro-solid2": "workspace:*",
    "@solidjs/web": "2.0.0-beta.19",
    "astro": "7.1.0",
    "solid-js": "2.0.0-beta.19"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.9",
    "@tailwindcss/vite": "4.3.3",
    "tailwindcss": "4.3.3",
    "typescript": "6.0.3"
  }
}
```

---

# 17. Astro configuration

Create `apps/docs/astro.config.ts`:

```ts
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import solid from "@solid-ui/astro-solid2";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",

  integrations: [
    solid({
      devtools: false,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
```

Use Astro’s current official Tailwind 4 setup through the Tailwind Vite plugin. The old `@astrojs/tailwind` integration is deprecated.

Do not add an Astro server adapter.

---

# 18. Tailwind setup

Create:

```css
/* apps/docs/src/styles/global.css */

@import "tailwindcss";
```

Import this stylesheet once from `index.astro`.

Do not create a `tailwind.config.*` file unless Tailwind itself requires one for the exact pinned release.

Keep the visual design simple but polished enough to distinguish:

- SSR baseline
- immediate hydration
- idle hydration
- media-query hydration
- visibility hydration
- client-only rendering

---

# 19. Solid component requirements

Create six separate components.

Do not create one shared counter component.

Each component should independently contain:

- `createSignal(0)`
- one visible numeric count
- one increment button
- one unique component heading
- stable `data-testid` values
- no external state
- no context
- no async data
- no cleanup logic
- no props unless required for a heading
- no Kobalte or Corvu dependencies

Because Solid 2 batches updates, component unit tests may need to await a microtask before asserting the updated count.

## Required components

### `ServerCounter.tsx`

Purpose:

- establish that Solid 2 server rendering works without hydration

Behavior:

- render count `0`
- render a button
- the button must remain non-interactive in the browser because no `client:*` directive is present

Test IDs:

```text
server-counter
server-counter-value
server-counter-button
```

### `ClientLoadCounter.tsx`

Mounted with:

```astro
client:load
```

Test IDs:

```text
load-counter
load-counter-value
load-counter-button
```

### `ClientIdleCounter.tsx`

Mounted with:

```astro
client:idle
```

Use the default idle behavior.

Do not pass a timeout.

Test IDs:

```text
idle-counter
idle-counter-value
idle-counter-button
```

### `ClientMediaCounter.tsx`

Mounted with:

```astro
client:media="(min-width: 768px)"
```

Test IDs:

```text
media-counter
media-counter-value
media-counter-button
```

### `ClientVisibleCounter.tsx`

Mounted with:

```astro
client:visible
```

Place it clearly below the initial viewport.

Do not use `rootMargin`.

Test IDs:

```text
visible-counter
visible-counter-value
visible-counter-button
```

### `ClientOnlyCounter.tsx`

Mounted with:

```astro
client:only="solid-js"
```

Provide an Astro fallback slot.

Test IDs:

```text
only-counter
only-counter-value
only-counter-button
only-counter-fallback
```

Astro’s supported built-in client directives are `client:load`, `client:idle`, `client:visible`, `client:media`, and `client:only`. Components without a client directive are rendered as HTML without client JavaScript.

---

# 20. Build the single Astro page

Create only:

```text
apps/docs/src/pages/index.astro
```

The page must:

1. Import the global stylesheet.
2. Import all six components directly.
3. Explain that this is an Astro 7 + Solid 2 beta renderer playground.
4. Show the exact pinned versions.
5. Render the SSR baseline.
6. Render `client:load`.
7. Render `client:idle`.
8. Render `client:media`.
9. Add a large vertical spacer.
10. Render `client:visible` below the fold.
11. Render `client:only` with a fallback.

Example structure:

```astro
---
import ClientIdleCounter from "@/components/ClientIdleCounter";
import ClientLoadCounter from "@/components/ClientLoadCounter";
import ClientMediaCounter from "@/components/ClientMediaCounter";
import ClientOnlyCounter from "@/components/ClientOnlyCounter";
import ClientVisibleCounter from "@/components/ClientVisibleCounter";
import ServerCounter from "@/components/ServerCounter";

import "@/styles/global.css";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Astro 7 + Solid 2 Playground</title>
  </head>

  <body>
    <main>
      <header>
        <h1>Astro 7 + Solid 2 Playground</h1>
      </header>

      <section data-testid="server-section">
        <ServerCounter />
      </section>

      <section data-testid="load-section">
        <ClientLoadCounter client:load />
      </section>

      <section data-testid="idle-section">
        <ClientIdleCounter client:idle />
      </section>

      <section data-testid="media-section">
        <ClientMediaCounter client:media="(min-width: 768px)" />
      </section>

      <section data-testid="only-section">
        <ClientOnlyCounter client:only="solid-js">
          <div slot="fallback" data-testid="only-counter-fallback">
            Loading client-only component…
          </div>
        </ClientOnlyCounter>
      </section>

      <div aria-hidden="true" class="min-h-[150vh]"></div>

      <section data-testid="visible-section">
        <ClientVisibleCounter client:visible />
      </section>
    </main>
  </body>
</html>
```

The final HTML and Tailwind classes can be improved, but the hydration layout and test IDs must remain stable.

---

# 21. Vitest configuration

Create one root `vitest.config.ts`.

Use:

- `happy-dom`
- the Solid 2 Vite plugin
- co-located unit tests
- no coverage requirement

Example:

```ts
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
    }),
  ],

  test: {
    environment: "happy-dom",
    include: ["apps/**/*.test.{ts,tsx}", "packages/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**", "**/node_modules/**", "**/dist/**"],
  },
});
```

---

# 22. Component unit tests

Create one co-located test per Solid component.

Each test should:

1. Render the component with `render` from `@solidjs/web`.
2. Assert the initial value is `0`.
3. Dispatch a click on the component’s button.
4. Await the Solid 2 update batch.
5. Assert the value is `1`.
6. Dispose the rendered root.

Do not test Astro hydration directives in Vitest.

Vitest verifies that the Solid 2 components themselves work.

Playwright verifies that Astro hydrates them at the right time.

---

# 23. Playwright configuration

Create root `playwright.config.ts`.

Use Chromium only.

Run against the static production build through `astro preview`.

Example:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "html",

  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  webServer: {
    command: "pnpm --filter docs preview --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: true,
  },
});
```

Do not add Firefox or WebKit.

Do not run Playwright against `astro dev`.

The root `test:e2e` command must build the repository before starting Playwright.

Install Chromium during initial repository setup:

```bash
pnpm exec playwright install chromium
```

---

# 24. Playwright hydration tests

Create:

```text
tests/e2e/hydration.spec.ts
```

Use stable `data-testid` selectors.

## Test 1: SSR baseline

Verify:

- the server counter is visible
- its value begins at `0`
- programmatically clicking its button does not change the value
- the page contains server-rendered counter markup before any interaction

## Test 2: `client:load`

Verify:

- the counter becomes interactive immediately
- one click changes `0` to `1`

## Test 3: `client:idle`

Verify:

- the counter eventually becomes interactive without scrolling or resizing
- one click changes `0` to `1`

Use polling or retrying assertions rather than arbitrary long sleeps.

## Test 4: `client:media`

Start the test with a viewport width below 768 pixels:

```ts
await page.setViewportSize({
  width: 640,
  height: 800,
});
```

Before the media query matches:

- trigger a DOM click without scrolling
- verify the value remains `0`

Resize to:

```ts
await page.setViewportSize({
  width: 1024,
  height: 800,
});
```

Then:

- wait until the component hydrates
- click normally
- verify the value changes to `1`

## Test 5: `client:visible`

Before scrolling:

- do not use Playwright locator click because that can scroll the target into view
- trigger a DOM click with `page.evaluate`
- verify the value remains `0`

Then:

- scroll the component into view
- wait for hydration
- click normally
- verify the value changes to `1`

## Test 6: `client:only`

Verify:

- the fallback is present during the initial client-only loading phase when observable
- the fallback disappears
- the client-only component appears
- one click changes `0` to `1`

Avoid making the test dependent on observing the fallback for a precise number of milliseconds. The essential assertions are that the fallback markup is configured correctly and that the client-only component replaces it.

## Test 7: complete page smoke test

Verify:

- no uncaught page errors
- no hydration mismatch errors in the console
- all six sections exist
- all five hydrated counters eventually work under their required conditions

Collect page errors:

```ts
const pageErrors: Error[] = [];

page.on("pageerror", (error) => {
  pageErrors.push(error);
});
```

Collect console errors and fail on unexpected messages.

Allowlist only messages that are explicitly understood and documented.

Do not broadly ignore hydration warnings.

---

# 25. Root README

Create a detailed root `README.md` containing:

## Purpose

Explain that the repository is the experimental Solid 2 foundation for `solid-ui.com`.

## Status warning

Clearly state:

- Solid 2 is beta software
- the Astro integration is a local compatibility port
- dependency APIs may change
- this repository is not intended to publish the Astro integration

Solid’s maintainers describe the 2.0 beta as an ecosystem migration phase that may still contain bugs and behavioral changes.

## Requirements

Document:

```text
Node.js 24
pnpm 11.13.1
```

## Commands

Document only pnpm:

```bash
pnpm install
pnpm dev
pnpm build
pnpm check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm test
pnpm test:watch
pnpm test:e2e
pnpm validate
```

Do not provide npm or Yarn alternatives.

## Architecture

Document:

```text
apps/docs
packages/astro-solid2
tests/e2e
```

## Hydration coverage

List:

```text
SSR only
client:load
client:idle
client:visible
client:media
client:only
```

## Known limitations

Document:

- no Solid Devtools validation
- no SSR adapter
- Chromium only
- no Kobalte or Corvu yet
- Oxfmt skips `.astro`
- Oxlint only partially understands `.astro`
- integration source is consumed directly from TypeScript
- no attempt is made to track Astro upstream

## Future official integration switch

Document the manual replacement:

```diff
-import solid from "@solid-ui/astro-solid2";
+import solid from "@astrojs/solid-js";
```

Then:

```diff
-"@solid-ui/astro-solid2": "workspace:*"
+"@astrojs/solid-js": "<official Solid 2-compatible version>"
```

The hydration page should require no change if the official integration continues to use:

```astro
client:only="solid-js"
```

Astro’s official directive reference uses `solid-js` as the framework hint for Solid client-only components.

---

# 26. Integration package README

Create:

```text
packages/astro-solid2/README.md
```

Include:

## Purpose

State that the package is a private, temporary Astro renderer port for Solid 2 beta.

## Source attribution

State that the initial source was copied from Astro’s MIT-licensed:

```text
packages/integrations/solid
```

Include the upstream package name:

```text
@astrojs/solid-js
```

## Modifications

List only:

- `solid-js/web` → `@solidjs/web`
- `solid-js/store` → `solid-js`
- `Suspense` → `Loading`
- client/server entrypoints → `@solid-ui/astro-solid2`
- package exports point directly to `src`
- internal imports adjusted for source consumption

## Explicit non-maintenance statement

State:

- no upstream sync is intended
- no publishing is intended
- no compatibility guarantee is provided
- the package should be removed when Astro officially supports Solid 2

---

# 27. Git configuration files

Create a normal `.gitignore` including:

```text
node_modules
dist
.astro
.turbo
coverage
playwright-report
test-results
.DS_Store
*.local
```

Commit `pnpm-lock.yaml`.

Do not commit Playwright browser binaries.

Add a standard MIT `LICENSE` file.

---

# 28. Required command verification

The implementation is not complete until all of these pass from the repository root:

```bash
pnpm install
pnpm format
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm test:e2e
pnpm validate
```

Also manually verify:

```bash
pnpm dev
```

Then open the docs site and confirm:

- SSR content appears without JavaScript hydration
- `client:load` works
- `client:idle` works
- `client:media` activates only at 768 pixels or wider
- `client:visible` activates only after scrolling
- `client:only` replaces its fallback
- no hydration mismatch appears in the browser console

---

# 29. Acceptance criteria

The agent may declare the task complete only when all conditions below are true.

## Repository

- [ ] Repository structure matches the plan.
- [ ] Root package is private.
- [ ] Workspace packages are private.
- [ ] MIT license exists.
- [ ] No CI exists.
- [ ] No Git hooks exist.
- [ ] No update automation exists.
- [ ] No pnpm catalogs exist.
- [ ] No CLI package exists.

## Tooling

- [ ] Node 24 is enforced through `engines`.
- [ ] pnpm is pinned through `packageManager`.
- [ ] Turborepo runs app tasks.
- [ ] Root TypeScript config is shared.
- [ ] Root Oxlint config is shared.
- [ ] Root Oxfmt config is shared.
- [ ] ESLint is absent.
- [ ] Prettier is absent.
- [ ] Biome is absent.

## Integration

- [ ] The package is named `@solid-ui/astro-solid2`.
- [ ] It is consumed directly from `src`.
- [ ] It is based on the current Astro Solid integration structure.
- [ ] DOM imports use `@solidjs/web`.
- [ ] Store helpers come from `solid-js`.
- [ ] `Loading` replaces `Suspense`.
- [ ] Renderer identity remains compatible with `client:only="solid-js"`.
- [ ] Client/server entrypoints point to the private package.
- [ ] No package build is needed.
- [ ] Devtools are disabled.

## Docs application

- [ ] Astro output is static.
- [ ] Tailwind CSS 4 is configured through the official Vite plugin.
- [ ] The app uses the private integration through a workspace dependency.
- [ ] The app has a local `@/*` alias.
- [ ] Only one page exists.
- [ ] Each hydration directive has its own Solid component.
- [ ] The visible component is below the fold.
- [ ] The media query is `(min-width: 768px)`.
- [ ] The idle directive uses default behavior.
- [ ] The client-only component has a fallback.
- [ ] The SSR baseline has no client directive.

## Tests

- [ ] Vitest uses happy-dom.
- [ ] Integration smoke tests pass.
- [ ] Every counter has a component test.
- [ ] Playwright uses Chromium only.
- [ ] Playwright runs against `astro build` plus `astro preview`.
- [ ] Playwright verifies actual media-query hydration timing.
- [ ] Playwright verifies actual viewport visibility hydration timing.
- [ ] Browser console errors are checked.
- [ ] Hydration mismatch warnings fail the suite.

## Documentation

- [ ] Root README explains setup, architecture, commands, limitations, and migration.
- [ ] Package README contains Astro source attribution.
- [ ] Package README states that no upstream tracking is intended.
- [ ] Only pnpm commands are documented.

---

# 30. Implementation order

The agent should execute the work in this order:

1. Initialize the root pnpm workspace.
2. Add exact root tooling dependencies.
3. Add global TypeScript, Oxlint, and Oxfmt configuration.
4. Add Turborepo.
5. Add editor configuration.
6. Create `packages/astro-solid2`.
7. Copy the official Astro Solid integration source.
8. Apply only the required Solid 2 and package-entrypoint changes.
9. Add integration smoke tests.
10. Create the Astro docs app.
11. Add the private integration dependency.
12. Configure static output.
13. Configure official Tailwind 4 support.
14. Create the six Solid counter components.
15. Add their Vitest tests.
16. Create the single Astro hydration page.
17. Add Playwright configuration.
18. Add the hydration semantics tests.
19. Add both README files.
20. Add MIT licensing and Git ignores.
21. Run formatting.
22. Run linting.
23. Run type checks.
24. Run Vitest.
25. Build the production site.
26. Run Playwright against `astro preview`.
27. Run the full `pnpm validate`.
28. Fix every error rather than suppressing it.
29. Report the final file tree and command results.
