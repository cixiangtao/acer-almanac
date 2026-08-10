# acer-almanac

English | [简体中文](README.zh-CN.md)

A zero-runtime-dependency TypeScript package for deterministic Chinese almanac, lunar date, daily fortune, and birthday-luck calculations. The same date and inputs produce the same result.

## Install

Requires Node.js 22 or newer.

```bash
pnpm add acer-almanac
```

## Usage

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

`createAlmanac` uses the `v2` daily-fortune generator by default. Pass `{ fortuneVersion: "v1" }` to replay historical output.

The package also exports focused date parsing, lunar-calendar, daily-fortune, and birthday-luck APIs with complete TypeScript declarations.

## Links

- [Live preview](https://cixiangtao.github.io/acer-almanac/)
- [Source and full documentation](https://github.com/cixiangtao/acer-almanac)
- [Issues](https://github.com/cixiangtao/acer-almanac/issues)
- [Private security reporting](https://github.com/cixiangtao/acer-almanac/security/advisories/new)
- [Changelog](https://github.com/cixiangtao/acer-almanac/blob/master/CHANGELOG.md)

## License

[MIT](https://github.com/cixiangtao/acer-almanac/blob/master/LICENSE) © 2026 cixiangtao
