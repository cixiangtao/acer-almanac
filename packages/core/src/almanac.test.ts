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
    expect(result.fortuneVersion).toBe("v2");
    expect(result.fortune.good).toHaveLength(4);
    expect(result.fortune.bad).toHaveLength(3);
    expect(result.fortune.good[0]?.activity).toBe("轻松慢跑");
    expect(result.fortune.good[0]?.category).toBe("health");
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

  it("can replay the legacy fortune through an explicit option", () => {
    const result = createAlmanac({ year: 2026, month: 7, day: 13 }, undefined, {
      fortuneVersion: "v1",
    });

    expect(result.fortune.good[0]).toEqual({
      activity: "跳槽",
      description: "新工作待遇大幅提升",
      image: 29,
    });
  });
});
