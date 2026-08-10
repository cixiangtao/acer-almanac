# Contributing

English | [简体中文](CONTRIBUTING.zh-CN.md)

Thank you for improving acer-almanac. First identify the affected delivery surface: the core npm package, shared web component, Pages preview, or Chrome extension. Keep each change focused on one intent.

## Local checks

Use Node.js `^22.13.0` or `>=24.0.0` and pnpm `10.34.4`.

```bash
pnpm exec vp install
pnpm run check
pnpm run test
pnpm run build
```

Use `pnpm run dev` for the Pages preview and `pnpm run dev:extension` for extension development.

## Pull requests

1. Branch from the latest `master`.
2. Add or update tests for behavior changes.
3. Run checks proportional to the change; code, build, and release changes should pass the full commands above.
4. Explain the problem, approach, verification, and affected delivery surfaces in the pull request.
5. Never commit `.env.chrome-webstore`, credentials, build output, or store ZIP files.

Follow the repository's Conventional Commits style, such as `feat(core): ...`, `fix(extension): ...`, or `docs(readme): ...`.

Use GitHub Issues for ordinary bugs and feature requests. Follow [Security](SECURITY.md) for vulnerabilities and do not disclose them publicly.
