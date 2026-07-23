import { describe, expect, it } from "vite-plus/test";

import { createRandom, hashString, shuffle } from "./random";

describe("deterministic random utilities", () => {
  it("keeps the namespaced date hash stable", () => {
    expect(hashString("acer-almanac:fortune:v2|2026-07-13")).toBe(3_717_515_802);
  });

  it("keeps the seeded random sequence stable", () => {
    const random = createRandom(3_717_515_802);

    expect([random(), random(), random()]).toEqual([
      0.9169763159006834, 0.5278942810837179, 0.554141657659784,
    ]);
  });

  it("shuffles a copy without mutating its input", () => {
    const source = [1, 2, 3, 4, 5];
    const shuffled = shuffle(source, createRandom(42));

    expect(source).toEqual([1, 2, 3, 4, 5]);
    expect(shuffled).toEqual([1, 5, 3, 2, 4]);
  });
});
