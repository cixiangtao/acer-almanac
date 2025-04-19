import { describe, expect, it } from "vite-plus/test";

import { generateFortune, generateFortuneV1 } from "./fortune";

const date = { year: 2026, month: 7, day: 13 };

describe("generateFortune", () => {
  it("preserves the historical deterministic selection as v1", () => {
    expect(generateFortuneV1(date)).toEqual({
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

  it("returns stable v2 results without duplicate activities or images", () => {
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

  it("uses every category and image while keeping leap-year results varied", () => {
    const categories = new Set<string>();
    const images = new Set<number>();
    const results = new Set<string>();

    for (let day = 1; day <= 366; day += 1) {
      const current = new Date(Date.UTC(2024, 0, day, 12));
      const result = generateFortune({
        day: current.getUTCDate(),
        month: current.getUTCMonth() + 1,
        year: current.getUTCFullYear(),
      });

      results.add(JSON.stringify(result));
      for (const item of [...result.good, ...result.bad]) {
        if (item.category) categories.add(item.category);
        images.add(item.image);
      }
    }

    expect(categories.size).toBe(8);
    expect(images.size).toBe(54);
    expect(results.size).toBeGreaterThanOrEqual(360);
  });

  it("rejects invalid dates in both versions", () => {
    const invalidDate = { year: 2023, month: 2, day: 29 };

    expect(() => generateFortune(invalidDate)).toThrow(RangeError);
    expect(() => generateFortuneV1(invalidDate)).toThrow(RangeError);
  });

  it("keeps long-term activity and image distribution within bounds", () => {
    const activityCounts = new Map<string, number>();
    const imageCounts = new Map<number, number>();
    const results = new Set<string>();
    let days = 0;

    for (let year = 2000; year <= 2019; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const monthDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
        for (let day = 1; day <= monthDays; day += 1) {
          const result = generateFortune({ day, month, year });
          results.add(JSON.stringify(result));

          for (const item of [...result.good, ...result.bad]) {
            if (!item.activityId) {
              throw new Error("fortune v2 item is missing its stable activity ID");
            }
            activityCounts.set(item.activityId, (activityCounts.get(item.activityId) ?? 0) + 1);
            imageCounts.set(item.image, (imageCounts.get(item.image) ?? 0) + 1);
          }
          days += 1;
        }
      }
    }

    const frequencyRatio = (counts: ReadonlyMap<unknown, number>) => {
      const values = [...counts.values()];
      return Math.max(...values) / Math.min(...values);
    };

    expect(results.size).toBe(days);
    expect(activityCounts.size).toBe(64);
    expect(imageCounts.size).toBe(54);
    expect(frequencyRatio(activityCounts)).toBeLessThan(1.5);
    expect(frequencyRatio(imageCounts)).toBeLessThan(1.25);
  });
});
