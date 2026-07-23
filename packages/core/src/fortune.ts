import { assertCalendarDate, formatIsoDate, getWeekdayLabel } from "./date";
import { FORTUNE_CATEGORY_LABELS, FORTUNE_CONTENT } from "./fortune-content";
import { generateFortuneV1 } from "./fortune-v1";
import { createRandom, hashString, randomInteger, shuffle, type RandomSource } from "./random";
import type {
  CalendarDate,
  FortuneCategory,
  FortuneContentDefinition,
  FortuneItem,
  FortuneResult,
} from "./types";

export { FORTUNE_CATEGORY_LABELS, generateFortuneV1 };

const FORTUNE_NAMESPACE = "acer-almanac:fortune:v2";
const IMAGE_COUNT = 54;
const SAME_CATEGORY_PENALTY = 0.32;

type Season = "spring" | "summer" | "autumn" | "winter";
type CategoryWeights = Record<FortuneCategory, number>;

const WEEKDAY_WEIGHTS = {
  work: 1.7,
  learning: 1.35,
  health: 1.15,
  social: 0.9,
  home: 0.85,
  outdoors: 0.85,
  creativity: 1,
  entertainment: 0.75,
} as const satisfies CategoryWeights;

const WEEKEND_WEIGHTS = {
  work: 0.55,
  learning: 0.9,
  health: 1.2,
  social: 1.3,
  home: 1.25,
  outdoors: 1.55,
  creativity: 1.25,
  entertainment: 1.5,
} as const satisfies CategoryWeights;

const SEASON_MULTIPLIERS = {
  spring: {
    work: 1,
    learning: 1,
    health: 1.05,
    social: 1.05,
    home: 1,
    outdoors: 1.25,
    creativity: 1.1,
    entertainment: 1,
  },
  summer: {
    work: 0.95,
    learning: 1,
    health: 1.1,
    social: 1.15,
    home: 1,
    outdoors: 1.1,
    creativity: 1,
    entertainment: 1.1,
  },
  autumn: {
    work: 1.05,
    learning: 1.2,
    health: 1,
    social: 1,
    home: 1,
    outdoors: 1.2,
    creativity: 1.15,
    entertainment: 0.95,
  },
  winter: {
    work: 1,
    learning: 1.1,
    health: 1.1,
    social: 0.95,
    home: 1.3,
    outdoors: 0.72,
    creativity: 1.1,
    entertainment: 1.2,
  },
} as const satisfies Record<Season, CategoryWeights>;

const getSeason = (month: number): Season => {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
};

const getCategoryWeights = (date: CalendarDate): CategoryWeights => {
  const weekend = ["星期六", "星期日"].includes(getWeekdayLabel(date));
  const dayWeights = weekend ? WEEKEND_WEIGHTS : WEEKDAY_WEIGHTS;
  const seasonWeights = SEASON_MULTIPLIERS[getSeason(date.month)];

  return {
    work: dayWeights.work * seasonWeights.work,
    learning: dayWeights.learning * seasonWeights.learning,
    health: dayWeights.health * seasonWeights.health,
    social: dayWeights.social * seasonWeights.social,
    home: dayWeights.home * seasonWeights.home,
    outdoors: dayWeights.outdoors * seasonWeights.outdoors,
    creativity: dayWeights.creativity * seasonWeights.creativity,
    entertainment: dayWeights.entertainment * seasonWeights.entertainment,
  };
};

const pickWeightedIndex = (
  candidates: readonly FortuneContentDefinition[],
  weights: CategoryWeights,
  categoryUsage: ReadonlyMap<FortuneCategory, number>,
  random: RandomSource,
) => {
  const candidateWeights = candidates.map(({ category }) => {
    const usage = categoryUsage.get(category) ?? 0;
    return weights[category] * SAME_CATEGORY_PENALTY ** usage;
  });
  const totalWeight = candidateWeights.reduce((total, weight) => total + weight, 0);
  let threshold = random() * totalWeight;

  for (const [index, weight] of candidateWeights.entries()) {
    threshold -= weight;
    if (threshold < 0) return index;
  }

  return candidates.length - 1;
};

interface V2SelectionOptions {
  readonly count: number;
  readonly kind: "good" | "bad";
}

const selectV2Items = (
  candidates: FortuneContentDefinition[],
  images: readonly number[],
  imageOffset: number,
  weights: CategoryWeights,
  categoryUsage: Map<FortuneCategory, number>,
  random: RandomSource,
  { count, kind }: V2SelectionOptions,
) => {
  const items: FortuneItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const candidateIndex = pickWeightedIndex(candidates, weights, categoryUsage, random);
    const [activity] = candidates.splice(candidateIndex, 1);
    const image = images[imageOffset + index];

    if (!activity || image === undefined) {
      throw new RangeError("The fortune v2 candidate pool was exhausted");
    }

    const messages = activity[kind];
    const description = messages[randomInteger(random, messages.length)];
    categoryUsage.set(activity.category, (categoryUsage.get(activity.category) ?? 0) + 1);
    items.push({
      activity: activity.name,
      activityId: activity.id,
      category: activity.category,
      description,
      image,
    });
  }

  return items;
};

/**
 * Generates the current deterministic fortune result for a date.
 *
 * The selection contains no duplicate activities or images.
 */
export const generateFortuneV2 = (date: CalendarDate): FortuneResult => {
  assertCalendarDate(date);
  const random = createRandom(hashString(`${FORTUNE_NAMESPACE}|${formatIsoDate(date)}`));
  const goodCount = 2 + randomInteger(random, 3);
  const badCount = 2 + randomInteger(random, 3);
  const candidates: FortuneContentDefinition[] = [...FORTUNE_CONTENT];
  const images = shuffle(
    Array.from({ length: IMAGE_COUNT }, (_, index) => index + 1),
    random,
  );
  const weights = getCategoryWeights(date);
  const categoryUsage = new Map<FortuneCategory, number>();
  const good = selectV2Items(candidates, images, 0, weights, categoryUsage, random, {
    count: goodCount,
    kind: "good",
  });
  const bad = selectV2Items(candidates, images, goodCount, weights, categoryUsage, random, {
    count: badCount,
    kind: "bad",
  });

  return { good, bad };
};

/** Alias for the current fortune algorithm. */
export const generateFortune = generateFortuneV2;
