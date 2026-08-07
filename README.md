# acer-almanac

Acer 专用老黄历工作区：一个可发布的纯 TypeScript npm 包、一套共享 Lit Web Component、
Chrome Manifest V3 扩展和 GitHub Pages 在线预览。

- 在线预览：<https://cixiangtao.github.io/acer-almanac/>
- npm：<https://www.npmjs.com/package/acer-almanac>
- Chrome 扩展：<https://chromewebstore.google.com/detail/acer-老黄历/ebfbfkkfffdlbgicfpallochceijmnnd>

## 工作区

```text
packages/core           acer-almanac npm 包（零运行时依赖）
packages/web-component  Pages 与 Chrome 扩展共享的 Lit UI
apps/web                GitHub Pages 预览应用
apps/chrome-extension   Chrome Manifest V3 扩展
```

核心包与 UI 分离：Node.js 或框架项目只安装 `acer-almanac` 时，不会引入 Lit、DOM 或图片资源。

## 开发

仓库使用 Node.js `^22.13.0` 或 `>=24.0.0`、Vite+ 与 pnpm `10.34.4`：

```bash
pnpm exec vp install
pnpm run dev
```

常用命令：

```bash
pnpm run check            # 格式、lint、类型检查
pnpm run test             # 核心包与 Web Component 测试
pnpm run build            # 构建 npm 包、Pages 和 Chrome 扩展
pnpm run build:core       # 仅构建 packages/core/dist
pnpm run build:extension  # 仅构建 apps/chrome-extension/dist
```

## npm 核心包

```bash
pnpm add acer-almanac
```

```ts
import { createAlmanac, parseIsoDate } from "acer-almanac";

const date = parseIsoDate("2026-07-13");
if (date) {
  console.log(createAlmanac(date));
}
```

`acer-almanac` 输出 ESM、source map 与 TypeScript 声明。每日宜忌默认使用 `v2`，同一天始终得到
相同结果；需要回放旧结果时可以传入 `{ fortuneVersion: "v1" }`。

npm 核心包由 Release Please 自动维护发版 PR并同步根目录与 `packages/core/package.json` 的版本。
维护者检查建议版本、Changelog 和必需 CI 后合并，GitHub Actions 才会构建、创建 `v<version>`、
发布 npm 并创建 GitHub Release。本地不升版本、不打发版 tag，也不运行 `npm publish`。

完整版本、验证和失败恢复约定见 [发布说明](RELEASING.md)，历史变更见
[Changelog](CHANGELOG.md)。

## Chrome 扩展

普通用户可以直接从
[Chrome Web Store](https://chromewebstore.google.com/detail/acer-老黄历/ebfbfkkfffdlbgicfpallochceijmnnd)
安装。

本地开发时运行：

```bash
pnpm run build:extension
```

然后打开 `chrome://extensions`，启用“开发者模式”，点击“加载已解压的扩展程序”，选择
`apps/chrome-extension/dist`。扩展只申请 `storage` 权限，用于保存生日；所有黄历计算均在本地完成。

扩展隐私政策发布在：

<https://cixiangtao.github.io/acer-almanac/privacy.html>

### Chrome Web Store 自动发布

Chrome Web Store 首个条目、商店详情、隐私声明和首次可见范围需要在 Developer Dashboard
中设置。首次发布完成后，可使用 API V2 自动提交后续版本。

将本地忽略文件 `.env.chrome-webstore` 填写完整：

```dotenv
CWS_CLIENT_ID=
CWS_CLIENT_SECRET=
CWS_REFRESH_TOKEN=
CWS_PUBLISHER_ID=
CWS_EXTENSION_ID=
```

检查后同步到 GitHub 的 `chrome-web-store` environment：

```bash
pnpm run cws:secrets -- --dry-run
pnpm run cws:secrets
pnpm run cws:status
```

后续从最新 `master` 创建 `release/chrome-v<version>`，同步提升
`apps/chrome-extension/public/manifest.json` 与 `apps/chrome-extension/package.json`，并通过
Release PR 合入。`Publish Chrome Extension` 只接受这类已合并 PR，会执行来源检查、测试、构建、
打包和商店提交；本地版本已发布或已提交审核时会安全跳过。

## GitHub Pages

`.github/workflows/deploy-pages.yml` 会在推送到 `master` 后执行检查、测试和全量构建，再将
`apps/web/dist` 发布到 GitHub Pages。预览应用使用 `/acer-almanac/` 子路径 base，Chrome 扩展则使用
相对资源路径，两者拥有独立构建配置。

## Web Component 约定

内部共享组件标签为：

```html
<acer-almanac date="2026-07-13" birthday="1993-01-12"></acer-almanac>
```

- `date`：当前展示日期，格式为 `YYYY-MM-DD`，省略时使用本地当天。
- `birthday`：用于计算运势的生日，格式为 `YYYY-MM-DD`。
- `date-change`：用户切换日期时触发，`detail` 为 `{ date }`。
- `birthday-change`：用户确认生日时触发，`detail` 为 `{ birthday }`。

两个事件都会冒泡并穿过 Shadow DOM。

## 参与和支持

- 贡献代码前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。
- 普通问题和功能建议请参考 [SUPPORT.md](SUPPORT.md)。
- 安全漏洞请通过 [SECURITY.md](SECURITY.md) 中的私密渠道报告。

## License

[MIT](LICENSE) © 2026 cixiangtao
