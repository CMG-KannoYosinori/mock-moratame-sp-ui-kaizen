## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

If `npm run dev` says another server is already running, or `localhost:4321` shows **stale HTML that does not match the `.astro` sources**, orphaned Node processes are likely still listening. `astro dev stop` only stops the server Astro is tracking; leftovers on other ports stay up.

```
# see listeners
lsof -nP -iTCP:4321-4330 -sTCP:LISTEN

# stop the tracked one, then kill orphans if needed
astro dev stop
kill <pid>   # only the leftover astro/vite PIDs from this repo
```

Prefer one server. After cleanup, start again with `npm run dev` or `astro dev --background`, and open the URL that `astro dev status` reports.

## Documentation

Full documentation: https://docs.astro.build

Project-specific theme / no-jqm notes: `docs/theme-2026-caution.md`

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
