# acer-almanac

Acer 专用老黄历，现已重构为一个由 Lit 驱动的原生 Web Component。

## 开发

```bash
vp install
vp dev
```

完整验证：

```bash
vp check
vp test
vp build
```

## Web Component

导入 `src/components/acer-almanac.ts` 后即可在任意 HTML 页面使用：

```html
<acer-almanac date="2026-07-13" birthday="1993-01-12"></acer-almanac>
```

- `date`：当前展示日期，格式为 `YYYY-MM-DD`，省略时使用本地当天。
- `birthday`：用于计算运势的生日，格式为 `YYYY-MM-DD`。
- `date-change`：用户切换日期时触发，`detail` 为 `{ date }`。
- `birthday-change`：用户确认生日时触发，`detail` 为 `{ birthday }`。

两个事件都会冒泡并穿过 Shadow DOM。组件内部不依赖 Vue、Element UI 或全局样式。

## 算法包

`src/almanac` 提供纯 TypeScript API：

```ts
import { createAlmanac, parseIsoDate } from "./src/almanac";

const date = parseIsoDate("2026-07-13");
if (date) {
  console.log(createAlmanac(date));
}
```

每日宜忌默认使用 `v2`：同一天始终得到相同结果，并通过稳定哈希、无放回加权选择和分类去重改善长期分布。内容包含工作、学习、健康、社交、居家、户外、创作、娱乐 8 个分类，共 64 个活动；每个活动都有多套宜忌文案，54 张图片都会参与生成。

需要回放旧版本结果时可以显式选择 `v1`：

```ts
const result = createAlmanac(date, undefined, { fortuneVersion: "v1" });
```

农历由运行时的中文农历日历格式化器生成，不再受旧版 1921–2020 数据表限制。
