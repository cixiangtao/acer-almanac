import { formatIsoDate, getWeekdayLabel, isCalendarDate } from "./date";
import { generateFortune, generateFortuneV1 } from "./fortune";
import { calculateLuck } from "./luck";
import { getLunarDate } from "./lunar";
import type { AlmanacOptions, AlmanacResult, CalendarDate, FortuneVersion } from "./types";

/**
 * Builds the complete almanac result for a calendar date.
 *
 * Results are deterministic for the same date, birthday, and fortune version.
 *
 * @throws {RangeError} When either date is invalid or the fortune version is unsupported.
 */
export const createAlmanac = (
  date: CalendarDate,
  birthday?: CalendarDate,
  { fortuneVersion = "v2" }: AlmanacOptions = {},
): AlmanacResult => {
  if (!isCalendarDate(date) || (birthday && !isCalendarDate(birthday))) {
    throw new RangeError("createAlmanac expects valid calendar dates");
  }

  const fortuneGenerators = {
    v1: generateFortuneV1,
    v2: generateFortune,
  } as const satisfies Record<FortuneVersion, typeof generateFortune>;
  const generate = fortuneGenerators[fortuneVersion];
  if (!generate) {
    throw new RangeError(`Unsupported fortune version: ${fortuneVersion}`);
  }

  return {
    date,
    fortune: generate(date),
    fortuneVersion,
    isoDate: formatIsoDate(date),
    luck: birthday ? calculateLuck(date, birthday) : null,
    lunar: getLunarDate(date),
    weekday: getWeekdayLabel(date),
  };
};
