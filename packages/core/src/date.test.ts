import { describe, expect, it } from "vite-plus/test";

import { addDays, formatIsoDate, getWeekdayLabel, parseIsoDate } from "./date";

describe("civil date utilities", () => {
  it("parses and formats strict ISO calendar dates", () => {
    const leapDay = { year: 2024, month: 2, day: 29 };

    expect(parseIsoDate("2024-02-29")).toEqual(leapDay);
    expect(formatIsoDate(leapDay)).toBe("2024-02-29");
    expect(parseIsoDate("2024-2-29")).toBeNull();
    expect(parseIsoDate("2023-02-29")).toBeNull();
    expect(parseIsoDate("not-a-date")).toBeNull();
  });

  it("moves across month and year boundaries", () => {
    expect(addDays({ year: 2024, month: 2, day: 29 }, 1)).toEqual({
      year: 2024,
      month: 3,
      day: 1,
    });
    expect(addDays({ year: 2025, month: 1, day: 1 }, -1)).toEqual({
      year: 2024,
      month: 12,
      day: 31,
    });
  });

  it("derives the weekday from the selected date", () => {
    expect(getWeekdayLabel({ year: 2026, month: 7, day: 13 })).toBe("星期一");
  });

  it("rejects invalid dates at every public formatting boundary", () => {
    const invalidDate = { year: 2023, month: 2, day: 29 };

    expect(() => formatIsoDate(invalidDate)).toThrow(RangeError);
    expect(() => getWeekdayLabel(invalidDate)).toThrow(RangeError);
  });
});
