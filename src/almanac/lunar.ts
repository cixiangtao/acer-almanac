import { toUtcDate } from "./date";
import type { CalendarDate, LunarDate } from "./types";

const ZODIAC = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
const chineseCalendarFormatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
  dateStyle: "full",
  timeZone: "UTC",
});

export const getLunarDate = (date: CalendarDate): LunarDate => {
  const parts = Object.fromEntries(
    chineseCalendarFormatter.formatToParts(toUtcDate(date)).map(({ type, value }) => [type, value]),
  ) as Record<string, string>;
  const relatedYear = Number(parts.relatedYear);
  const yearName = parts.yearName;
  const month = parts.month;
  const day = parts.day;

  if (!Number.isInteger(relatedYear) || !yearName || !month || !day) {
    throw new RangeError("The runtime could not format the Chinese lunar date");
  }

  const zodiacIndex = (((relatedYear - 4) % ZODIAC.length) + ZODIAC.length) % ZODIAC.length;
  const zodiac = ZODIAC[zodiacIndex];

  return {
    day,
    month,
    text: `${yearName}(${zodiac})年 ${month}${day}`,
    yearName,
    zodiac,
  };
};
