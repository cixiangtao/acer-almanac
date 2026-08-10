# acer-almanac

English | [简体中文](README.zh-CN.md)

An Acer-themed daily almanac workspace with four delivery surfaces: a zero-runtime-dependency TypeScript package, shared Lit web components, a Manifest V3 Chrome extension, and a GitHub Pages preview.

- [Live preview](https://cixiangtao.github.io/acer-almanac/)
- [npm package](https://www.npmjs.com/package/acer-almanac)
- [Chrome Web Store](https://chromewebstore.google.com/detail/acer-老黄历/ebfbfkkfffdlbgicfpallochceijmnnd)

## Workspace

```text
packages/core           Framework-free `acer-almanac` npm package
packages/web-component  Shared Lit UI for the web app and extension
apps/web                GitHub Pages preview
apps/chrome-extension   Chrome Manifest V3 extension
```

Installing `acer-almanac` alone does not add Lit, DOM code, or image assets to a Node.js or framework project.

## Development

The repository requires Node.js `^22.13.0` or `>=24.0.0`, Vite+, and pnpm `10.34.4`.

```bash
pnpm exec vp install
pnpm run dev
```

```bash
pnpm run check            # formatting, linting, and type checks
pnpm run test             # core package and web-component tests
pnpm run build            # package, Pages app, and extension
pnpm run build:core       # packages/core/dist only
pnpm run build:extension  # apps/chrome-extension/dist only
```

## Core package

```bash
pnpm add acer-almanac
```

```ts
import { createAlmanac, parseIsoDate } from "acer-almanac";

const date = parseIsoDate("2026-07-13");
if (date) console.log(createAlmanac(date));
```

The package ships ESM, source maps, and TypeScript declarations. Fortune generation is deterministic for the same date. The current algorithm is `v2`; pass `{ fortuneVersion: "v1" }` when replaying older output.

Release Please maintains the package version and changelog through a release PR. After that PR passes required checks and is merged, GitHub Actions creates `v<version>`, publishes the inspected package through npm trusted publishing, and creates the GitHub Release. Maintainers do not publish or create release tags locally. See [Releasing](RELEASING.md) and the [changelog](CHANGELOG.md).

## Chrome extension

Build the extension with `pnpm run build:extension`, then load `apps/chrome-extension/dist` as an unpacked extension from `chrome://extensions`. It requests only `storage` to remember the birthday; all almanac calculations stay local. The [privacy policy](https://cixiangtao.github.io/acer-almanac/privacy.html) is published with the Pages site.

The first Chrome Web Store listing is configured in the Developer Dashboard. Later releases are accepted only from merged `release/chrome-v<version>` pull requests that update both extension version files. The publishing workflow verifies provenance, runs checks, builds the ZIP, and submits it. A successful submission is not the same as a publicly installable version; verify both `pnpm run cws:status` and the public store listing.

## GitHub Pages

Pushes to `master` run checks, tests, and the full build before `apps/web/dist` is deployed. The web app uses the `/acer-almanac/` base path; the extension uses relative assets through a separate build configuration.

## Web component contract

```html
<acer-almanac date="2026-07-13" birthday="1993-01-12"></acer-almanac>
```

- `date` and `birthday` use `YYYY-MM-DD`.
- `date-change` emits `{ date }`.
- `birthday-change` emits `{ birthday }`.
- Both events bubble and cross the Shadow DOM boundary.

## Community

- Read [Contributing](CONTRIBUTING.md) before opening a code change.
- Use [Support](SUPPORT.md) for ordinary questions and feature requests.
- Report vulnerabilities through the private channel in [Security](SECURITY.md).

## License

[MIT](LICENSE) © 2026 cixiangtao
