import { assertCalendarDate, getDateSeed } from "./date";
import { FORTUNE_ACTIVITIES } from "./fortune-data";
import type { CalendarDate, FortuneActivityDefinition, FortuneItem, FortuneResult } from "./types";

const LEGACY_MODULUS = 11_117;
const LEGACY_IMAGE_COUNT = 50;

export const mixLegacySeed = (seed: number, offset: number) => {
  let value = seed % LEGACY_MODULUS;

  for (let iteration = 0; iteration < 25 + offset; iteration += 1) {
    value = (value * value) % LEGACY_MODULUS;
  }

  return value;
};

interface LegacySelectionOptions {
  readonly activityOffset: number;
  readonly countOffset: number;
  readonly imageOffset: number;
  readonly kind: "good" | "bad";
}

const selectLegacyItems = (
  seed: number,
  activities: FortuneActivityDefinition[],
  images: number[],
  { activityOffset, countOffset, imageOffset, kind }: LegacySelectionOptions,
) => {
  const activityPercentile = mixLegacySeed(seed, activityOffset) % 100;
  const count = (mixLegacySeed(seed, countOffset) % 3) + 2;
  const items: FortuneItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const activityIndex = Math.floor((activityPercentile / 100) * activities.length);
    const [activity] = activities.splice(activityIndex, 1);
    const imagePercentile = mixLegacySeed(seed, imageOffset + index) % 100;
    const imageIndex = Math.floor((imagePercentile / 100) * images.length);
    const [image] = images.splice(imageIndex, 1);

    if (!activity || image === undefined) {
      throw new RangeError("The legacy fortune candidate pool was exhausted");
    }

    items.push({
      activity: activity.name,
      description: activity[kind],
      image,
    });
  }

  return items;
};

export const generateFortuneV1 = (date: CalendarDate): FortuneResult => {
  assertCalendarDate(date);
  const seed = getDateSeed(date);
  const activities: FortuneActivityDefinition[] = [...FORTUNE_ACTIVITIES];
  const images = Array.from({ length: LEGACY_IMAGE_COUNT }, (_, index) => index + 1);

  return {
    good: selectLegacyItems(seed, activities, images, {
      activityOffset: 8,
      countOffset: 9,
      imageOffset: 3,
      kind: "good",
    }),
    bad: selectLegacyItems(seed, activities, images, {
      activityOffset: 4,
      countOffset: 7,
      imageOffset: 2,
      kind: "bad",
    }),
  };
};
