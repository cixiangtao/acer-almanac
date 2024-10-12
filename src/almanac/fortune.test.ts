import { describe, expect, it } from "vite-plus/test";

import { generateFortune } from "./fortune";

const date = { year: 2026, month: 7, day: 13 };

describe("generateFortune", () => {
  it("reproduces the historical deterministic selection", () => {
    expect(generateFortune(date)).toEqual({
      good: [
        { activity: "跳槽", description: "新工作待遇大幅提升", image: 29 },
        { activity: "网购", description: "商品大减价", image: 45 },
        { activity: "抢沙发", description: "沙发入手弹无虚发", image: 27 },
      ],
      bad: [
        {
          activity: "早睡",
          description: "会在半夜醒来，然后失眠",
          image: 39,
        },
        { activity: "读书", description: "注意力完全无法集中", image: 28 },
      ],
    });
  });

  it("returns stable results without duplicate activities or images", () => {
    const first = generateFortune(date);
    const second = generateFortune(date);
    const items = [...first.good, ...first.bad];

    expect(second).toEqual(first);
    expect(new Set(items.map(({ activity }) => activity)).size).toBe(items.length);
    expect(new Set(items.map(({ image }) => image)).size).toBe(items.length);
    expect(first.good.length).toBeGreaterThanOrEqual(2);
    expect(first.good.length).toBeLessThanOrEqual(4);
    expect(first.bad.length).toBeGreaterThanOrEqual(2);
    expect(first.bad.length).toBeLessThanOrEqual(4);
  });
});
