import type { CalendarDate } from "./types";

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MINIMUM_YEAR = 1900;
const MAXIMUM_YEAR = 9999;
const WEEKDAY_LABELS = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
] as const;

const isLeapYear = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const getDaysInMonth = (year: number, month: number) => {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1] ?? 0;
};

export const isCalendarDate = (date: CalendarDate) => {
  const { day, month, year } = date;

  return (
    Number.isInteger(year) &&
    year >= MINIMUM_YEAR &&
    year <= MAXIMUM_YEAR &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12 &&
    Number.isInteger(day) &&
    day >= 1 &&
    day <= getDaysInMonth(year, month)
  );
};

export const assertCalendarDate = (date: CalendarDate, label = "date"): void => {
  if (!isCalendarDate(date)) {
    throw new RangeError(`${label} must be a valid calendar date`);
  }
};

export const parseIsoDate = (value: string): CalendarDate | null => {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;

  const [, yearValue, monthValue, dayValue] = match;
  const date = {
    day: Number(dayValue),
    month: Number(monthValue),
    year: Number(yearValue),
  };

  return isCalendarDate(date) ? date : null;
};

export const formatIsoDate = (date: CalendarDate) => {
  assertCalendarDate(date);
  const { day, month, year } = date;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const toUtcDate = (date: CalendarDate) => {
  assertCalendarDate(date);
  const { day, month, year } = date;

  return new Date(Date.UTC(year, month - 1, day, 12));
};

export const getToday = (now = new Date()): CalendarDate => ({
  day: now.getDate(),
  month: now.getMonth() + 1,
  year: now.getFullYear(),
});

export const addDays = (date: CalendarDate, amount: number): CalendarDate => {
  assertCalendarDate(date);
  if (!Number.isInteger(amount)) {
    throw new RangeError("addDays expects an integer amount");
  }

  const shifted = toUtcDate(date);
  shifted.setUTCDate(shifted.getUTCDate() + amount);

  return {
    day: shifted.getUTCDate(),
    month: shifted.getUTCMonth() + 1,
    year: shifted.getUTCFullYear(),
  };
};

export const getWeekdayLabel = (date: CalendarDate) => WEEKDAY_LABELS[toUtcDate(date).getUTCDay()];

export const getDateSeed = ({ day, month, year }: CalendarDate) =>
  37_621 * year + 539 * month + day;

export const toCompactDateNumber = ({ day, month, year }: CalendarDate) =>
  year * 10_000 + month * 100 + day;
