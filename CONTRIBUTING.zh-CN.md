# 参与贡献

[English](CONTRIBUTING.md) | 简体中文

感谢你愿意改进 acer-almanac。提交代码前，请先确认改动属于 npm 核心包、共享 Web Component、
GitHub Pages 预览或 Chrome 扩展中的哪一个交付面，并尽量保持一次提交只表达一个意图。

## 开发环境

- Node.js `^22.13.0` 或 `>=24.0.0`
- pnpm `10.34.4`

```bash
pnpm exec vp install
pnpm run check
pnpm run test
pnpm run build
```

开发 Pages 预览使用 `pnpm run dev`，开发 Chrome 扩展使用
`pnpm run dev:extension`。

## 提交 Pull Request

1. 从最新的 `master` 创建分支。
2. 为行为变化补充或更新测试。
3. 运行与改动相关的检查；代码、构建或发布改动应运行完整的
   `check`、`test` 和 `build`。
4. 在 Pull Request 中说明问题、解决方式、验证结果和受影响的交付面。
5. 不要提交 `.env.chrome-webstore`、构建产物、商店 ZIP 或其他凭据。

提交信息沿用仓库现有的 Conventional Commits 风格，例如
`feat(core): ...`、`fix(extension): ...` 和 `docs(readme): ...`。

普通问题和功能建议请使用 GitHub Issues；安全漏洞请遵循
[安全政策](SECURITY.md)，不要公开披露。
