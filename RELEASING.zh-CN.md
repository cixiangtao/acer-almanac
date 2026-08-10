# 发布说明

[English](RELEASING.md) | 简体中文

仓库包含三个独立交付面。它们共享源码和质量门禁，但不共享同一个公开版本。

## npm 核心包

- 版本来源：根目录与 `packages/core/package.json`，两者由自动发版 PR 同步维护
- 版本策略：Semantic Versioning
- 发布来源：干净的 `master`
- Git tag：`v<version>`，仅代表 `acer-almanac` npm 核心包
- 交付目标：npm registry
- 变更记录：根目录 `CHANGELOG.md`

普通产品改动先通过 PR 和必需检查合入受保护的 `master`。Release Please 随后从
`release-please--branches--master--...` 分支持续更新唯一的 npm 自动发版 PR，并根据 Conventional
Commit 或 squash merge 标题生成建议版本与 `CHANGELOG.md`：`fix` 为 patch，`feat` 为 minor，`!`
或 `BREAKING CHANGE` 为 major。

维护者检查发版 PR 的受限 diff、同步版本、Changelog 和 CI，并在准备发布时合并。GitHub Actions
会反查这次合并，执行质量门禁和 npm 打包，在同一条链路中创建 tag、发布已检查的 npm 产物并创建
GitHub Release。普通 PR 合并不会发布，其他无关 PR 可以保持打开；不要在本地升版本、打 tag 或运行
`npm publish`。

首次使用该流程前，需要在 npm 包设置中将 trusted publisher 配置为 GitHub Actions、仓库
`cixiangtao/acer-almanac`、工作流 `release-npm.yml`，并允许 `npm publish`；仓库不保存长期 npm 发布令牌。

仓库还需要配置 Actions variable `RELEASE_APP_CLIENT_ID` 和 secret
`RELEASE_APP_PRIVATE_KEY`，对应一个已安装到本仓库、具有 Contents、Issues、Pull requests 读写权限的
GitHub App。使用 App token 可让自动发版 PR 的必需 CI 无人值守运行；默认 `GITHUB_TOKEN` 创建的
PR 目前需要维护者另行批准工作流。

发布后应独立检查：

```bash
npm view acer-almanac version dist-tags --json
```

并从 npm 下载公开 tarball，在干净临时目录中验证导入，同时核对 Git tag 与 GitHub Release。

## Chrome 扩展

- 版本来源：`apps/chrome-extension/public/manifest.json` 与
  `apps/chrome-extension/package.json`
- 版本策略：Chrome Web Store 接受的数字版本
- 发布来源：`master`
- Git tag：不使用；npm 的 `v<version>` tag 不代表扩展版本
- 交付目标：Chrome Web Store
- 凭据边界：GitHub `chrome-web-store` environment

两个版本文件必须同步提升。从最新 `master` 创建 `release/chrome-v<version>`，只更新两个版本文件
和 Changelog，然后创建 Release PR。该 PR 通过检查并合入后，`Publish Chrome Extension` 会反查
合并来源、检查受限 diff，再执行检查、测试、构建、打包和商店提交。

手工 tag、workflow dispatch 和本地上传都不是正式发布入口。其他无关 PR 可以继续保持打开状态。

`PENDING_REVIEW`、`STAGED` 和 `PUBLISHED` 是不同交付状态。工作流成功提交不代表用户已经可以安装；
发布后必须使用 `pnpm run cws:status` 和公开商店页面分别验证。

## GitHub Pages

Pages 没有独立语义版本。每次推送到 `master` 都会经过检查、测试和全量构建，然后部署
`apps/web/dist`。发布后需要检查 Actions 结论、首页、构建资源和隐私政策内容。

## 失败恢复

- npm 发布失败后，检查工作区、index、本地/远端 tag 和 registry 版本，不能假设工具已完全回滚。
- Chrome 上传失败后，先读取商店状态；不要在未知状态下重复提升版本或重复提交。
- Pages 部署失败不会回滚 npm 或 Chrome 交付面，应分别报告各自状态。
