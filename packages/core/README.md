# acer-almanac

零运行时依赖的 TypeScript 老黄历核心包。同一个日期会稳定生成相同的农历、宜忌和运势结果。

## 安装

```bash
pnpm add acer-almanac
```

## 使用

```ts
import { createAlmanac, parseIsoDate } from "acer-almanac";

const date = parseIsoDate("2026-07-13");

if (date) {
  const result = createAlmanac(date, {
    year: 1993,
    month: 1,
    day: 12,
  });

  console.log(result.lunar.text);
  console.log(result.fortune.good);
  console.log(result.luck);
}
```

`createAlmanac` 默认使用 `v2` 宜忌生成器。需要回放历史结果时，可传入
`{ fortuneVersion: "v1" }`。

包同时导出日期解析、农历、宜忌和生日运势等细粒度 API，并附带完整 TypeScript 类型声明。
