export type RandomSource = () => number;

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const UINT32_RANGE = 4_294_967_296;

export const hashString = (input: string) => {
  let hash = FNV_OFFSET_BASIS;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME);
  }

  return hash >>> 0;
};

export const createRandom = (seed: number): RandomSource => {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };
};

export const randomInteger = (random: RandomSource, maximum: number) => {
  if (!Number.isInteger(maximum) || maximum <= 0) {
    throw new RangeError("randomInteger expects a positive integer maximum");
  }

  return Math.floor(random() * maximum);
};

export const shuffle = <T>(source: readonly T[], random: RandomSource) => {
  const result = [...source];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(random, index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
};
