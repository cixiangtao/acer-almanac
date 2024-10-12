import { describe, expect, it } from "vite-plus/test";

import { calculateLuck, getLuckLabel } from "./luck";

describe("birthday luck", () => {
  it("keeps the historical score for a fixed date and birthday", () => {
    expect(
      calculateLuck({ year: 2026, month: 7, day: 13 }, { year: 1993, month: 1, day: 12 }),
    ).toEqual({
      color: "rgb(56.4% 20% 20%)",
      label: "半吉",
      score: 58,
    });
  });

  it("maps every score boundary to its label", () => {
    expect([4, 5, 19, 20, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90].map(getLuckLabel)).toEqual([
      "大凶",
      "凶",
      "凶",
      "末吉",
      "末吉",
      "半吉",
      "半吉",
      "吉",
      "吉",
      "小吉",
      "小吉",
      "中吉",
      "中吉",
      "大吉",
    ]);
  });
});
