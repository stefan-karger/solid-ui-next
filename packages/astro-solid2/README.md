# `@solid-ui/astro-solid2`

## Purpose

This is a private, temporary Astro renderer port for the Solid 2 release candidate. It is disposable playground
infrastructure, not a package intended for general use.

## Source attribution

The initial source was copied from Astro's MIT-licensed `packages/integrations/solid` package,
published as `@astrojs/solid-js`.

## Modifications

- `solid-js/web` to `@solidjs/web`
- `solid-js/store` to `solid-js`
- `Suspense` to `Loading`
- Client and server entrypoints to `@solid-ui/astro-solid2`
- Package exports point directly to `src`
- Internal imports adjusted for source consumption

## Non-maintenance

No upstream synchronization or publishing is intended. No compatibility guarantee is provided.
This package should be removed when Astro officially supports Solid 2.
