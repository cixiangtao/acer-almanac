import { formatIsoDate, getWeekdayLabel, isCalendarDate } from "./date";
import { generateFortune } from "./fortune";
import { calculateLuck } from "./luck";
import { getLunarDate } from "./lunar";
import type { AlmanacResult, CalendarDate } from "./types";

export const createAlmanac = (date: CalendarDate, birthday?: CalendarDate): AlmanacResult => {
  if (!isCalendarDate(date) || (birthday && !isCalendarDate(birthday))) {
    throw new RangeError("createAlmanac expects valid calendar dates");
  }

  return {
    date,
    fortune: generateFortune(date),
    isoDate: formatIsoDate(date),
    luck: birthday ? calculateLuck(date, birthday) : null,
    lunar: getLunarDate(date),
    weekday: getWeekdayLabel(date),
  };
};
