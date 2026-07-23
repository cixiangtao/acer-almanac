# acer-almanac

Acer 专用老黄历工作区：一个可发布的纯 TypeScript npm 包、一套共享 Lit Web Component、
Chrome Manifest V3 扩展和 GitHub Pages 在线预览。

在线预览：<https://cixiangtao.github.io/acer-almanac/>

## 工作区

```text
packages/core           acer-almanac npm 包（零运行时依赖）
packages/web-component  Pages 与 Chrome 扩展共享的 Lit UI
apps/web                GitHub Pages 预览应用
apps/chrome-extension   Chrome Manifest V3 扩展
```

核心包与 UI 分离：Node.js 或框架项目只安装 `acer-almanac` 时，不会引入 Lit、DOM 或图片资源。

## 开发

仓库使用 Vite+ 与 pnpm：

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

发布前可检查真实 npm 内容：

```bash
cd packages/core
pnpm pack --dry-run
pnpm publish
```

## Chrome 扩展

```bash
pnpm run build:extension
```

然后打开 `chrome://extensions`，启用“开发者模式”，点击“加载已解压的扩展程序”，选择
`apps/chrome-extension/dist`。扩展只申请 `storage` 权限，用于保存生日；所有黄历计算均在本地完成。

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
