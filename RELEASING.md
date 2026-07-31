# 发布说明

仓库包含三个独立交付面。它们共享源码和质量门禁，但不共享同一个公开版本。

## npm 核心包

- 版本来源：`packages/core/package.json`
- 版本策略：Semantic Versioning
- 发布来源：干净的 `master`
- Git tag：`v<version>`，仅代表 `acer-almanac` npm 核心包
- 交付目标：npm registry
- 变更记录：根目录 `CHANGELOG.md`

发布前运行：

```bash
pnpm run release:check
pnpm run release:dry
```

确认版本和 Changelog 后运行 `pnpm run release`。`release-it` 会执行质量门禁、更新核心包版本、
创建 release commit 和 tag、推送并发布到 npm。

发布后应独立检查：

```bash
npm view acer-almanac version dist-tags --json
```

并从 npm 下载公开 tarball，在干净临时目录中验证导入。GitHub Releases 当前不属于 npm 发布契约；
仓库不附带需要通过 Release 分发的二进制产物。

## Chrome 扩展

- 版本来源：`apps/chrome-extension/public/manifest.json` 与
  `apps/chrome-extension/package.json`
- 版本策略：Chrome Web Store 接受的数字版本
- 发布来源：`master`
- Git tag：不使用；npm 的 `v<version>` tag 不代表扩展版本
- 交付目标：Chrome Web Store
- 凭据边界：GitHub `chrome-web-store` environment

两个版本文件必须同步提升。推送并通过 Pull Request 检查后，从 GitHub Actions 的
`Publish Chrome Extension` 手动触发。工作流会检查、测试、构建、打包，并在本地版本已经发布或
已提交时跳过重复上传。

`PENDING_REVIEW`、`STAGED` 和 `PUBLISHED` 是不同交付状态。工作流成功提交不代表用户已经可以安装；
发布后必须使用 `pnpm run cws:status` 和公开商店页面分别验证。

## GitHub Pages

Pages 没有独立语义版本。每次推送到 `master` 都会经过检查、测试和全量构建，然后部署
`apps/web/dist`。发布后需要检查 Actions 结论、首页、构建资源和隐私政策内容。

## 失败恢复

- npm 发布失败后，检查工作区、index、本地/远端 tag 和 registry 版本，不能假设工具已完全回滚。
- Chrome 上传失败后，先读取商店状态；不要在未知状态下重复提升版本或重复提交。
- Pages 部署失败不会回滚 npm 或 Chrome 交付面，应分别报告各自状态。
