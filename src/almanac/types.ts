export interface CalendarDate {
  readonly day: number;
  readonly month: number;
  readonly year: number;
}

export interface LunarDate {
  readonly day: string;
  readonly month: string;
  readonly text: string;
  readonly yearName: string;
  readonly zodiac: string;
}

export interface FortuneActivityDefinition {
  readonly bad: string;
  readonly good: string;
  readonly name: string;
}

export type FortuneCategory =
  | "work"
  | "learning"
  | "health"
  | "social"
  | "home"
  | "outdoors"
  | "creativity"
  | "entertainment";

export interface FortuneContentDefinition {
  readonly bad: readonly [string, string, ...string[]];
  readonly category: FortuneCategory;
  readonly good: readonly [string, string, ...string[]];
  readonly id: string;
  readonly name: string;
}

export interface FortuneItem {
  readonly activity: string;
  readonly description: string;
  readonly image: number;
}

export interface FortuneResult {
  readonly bad: readonly FortuneItem[];
  readonly good: readonly FortuneItem[];
}

export type LuckLabel = "大凶" | "凶" | "末吉" | "半吉" | "吉" | "小吉" | "中吉" | "大吉";

export interface LuckResult {
  readonly color: string;
  readonly label: LuckLabel;
  readonly score: number;
}

export interface AlmanacResult {
  readonly date: CalendarDate;
  readonly fortune: FortuneResult;
  readonly isoDate: string;
  readonly luck: LuckResult | null;
  readonly lunar: LunarDate;
  readonly weekday: string;
}
