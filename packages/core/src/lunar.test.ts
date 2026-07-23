import { describe, expect, it } from "vite-plus/test";

import { getLunarDate } from "./lunar";

describe("getLunarDate", () => {
  it("formats Lunar New Year", () => {
    expect(getLunarDate({ year: 2024, month: 2, day: 10 })).toEqual({
      day: "初一",
      month: "正月",
      text: "甲辰(龙)年 正月初一",
      yearName: "甲辰",
      zodiac: "龙",
    });
  });

  it("supports dates beyond the legacy 2020 table", () => {
    expect(getLunarDate({ year: 2026, month: 7, day: 13 }).text).toBe("丙午(马)年 五月廿九");
  });

  it("rejects invalid dates instead of normalizing them", () => {
    expect(() => getLunarDate({ year: 2023, month: 2, day: 29 })).toThrow(RangeError);
  });
});
