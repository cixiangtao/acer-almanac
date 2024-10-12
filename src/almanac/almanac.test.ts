import { describe, expect, it } from "vite-plus/test";

import { createAlmanac } from "./almanac";

describe("createAlmanac", () => {
  it("combines all date-derived information behind one API", () => {
    const result = createAlmanac(
      { year: 2026, month: 7, day: 13 },
      { year: 1993, month: 1, day: 12 },
    );

    expect(result.isoDate).toBe("2026-07-13");
    expect(result.weekday).toBe("星期一");
    expect(result.lunar.text).toBe("丙午(马)年 五月廿九");
    expect(result.fortune.good).toHaveLength(3);
    expect(result.fortune.bad).toHaveLength(2);
    expect(result.luck?.score).toBe(58);
  });

  it("leaves luck absent when no birthday is supplied", () => {
    expect(createAlmanac({ year: 2026, month: 7, day: 13 }).luck).toBeNull();
  });

  it("rejects invalid dates at the public boundary", () => {
    expect(() => createAlmanac({ year: 2023, month: 2, day: 29 })).toThrowError(
      "createAlmanac expects valid calendar dates",
    );
  });
});
