import { getDateSeed, toCompactDateNumber } from "./date";
import { mixSeed } from "./fortune";
import type { CalendarDate, LuckLabel, LuckResult } from "./types";

export const getLuckLabel = (score: number): LuckLabel => {
  if (score < 5) return "大凶";
  if (score < 20) return "凶";
  if (score < 50) return "末吉";
  if (score < 60) return "半吉";
  if (score < 70) return "吉";
  if (score < 80) return "小吉";
  if (score < 90) return "中吉";
  return "大吉";
};

export const calculateLuck = (date: CalendarDate, birthday: CalendarDate): LuckResult => {
  const score = mixSeed(getDateSeed(date) * toCompactDateNumber(birthday), 6) % 100;
  const red = Number((10 + 0.8 * score).toFixed(1));

  return {
    color: `rgb(${red}% 20% 20%)`,
    label: getLuckLabel(score),
    score,
  };
};
