# Almanac V2 Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve deterministic fortune variety, distribution, content breadth, and public API safety while retaining exact legacy-result playback.

**Architecture:** Move the historical mixer and selector to an explicit `fortune-v1` module. Make `fortune-v2` the default generator, using a stable string hash, independent deterministic PRNG, contextual category weights, weighted selection without replacement, and all 54 image assets. Keep validation at every exported boundary and let `createAlmanac` choose a version through typed options.

**Tech Stack:** TypeScript, Vite+, Vitest, Lit

---

### Task 1: Lock compatibility and public validation

**Files:**

- Modify: `src/almanac/fortune.test.ts`
- Modify: `src/almanac/almanac.test.ts`
- Modify: `src/almanac/date.test.ts`
- Modify: `src/almanac/luck.test.ts`
- Modify: `src/almanac/lunar.test.ts`

- [ ] **Step 1: Keep the existing `2026-07-13` output as a `generateFortuneV1` golden assertion**
- [ ] **Step 2: Add assertions that invalid dates throw from every exported date-consuming function**

```ts
expect(() => generateFortune({ year: 2023, month: 2, day: 29 })).toThrow(RangeError);
expect(() => calculateLuck(validDate, invalidDate)).toThrow(RangeError);
expect(() => getLunarDate(invalidDate)).toThrow(RangeError);
expect(() => getLuckLabel(100)).toThrow(RangeError);
```

- [ ] **Step 3: Run focused tests and confirm the new names and validation assertions fail**

### Task 2: Isolate deterministic random engines

**Files:**

- Create: `src/almanac/random.ts`
- Create: `src/almanac/random.test.ts`
- Create: `src/almanac/fortune-v1.ts`
- Modify: `src/almanac/luck.ts`

- [ ] **Step 1: Add fixed hash and PRNG sequence tests**
- [ ] **Step 2: Implement FNV-1a string hashing, Mulberry32 random generation, integer selection, and Fisher-Yates shuffle**
- [ ] **Step 3: Move the historical repeated-square mixer and selector unchanged into `fortune-v1.ts`**
- [ ] **Step 4: Keep legacy luck output stable by importing the historical mixer from `fortune-v1.ts`**

### Task 3: Add classified multi-variant content

**Files:**

- Create: `src/almanac/fortune-content.ts`
- Modify: `src/almanac/types.ts`

- [ ] **Step 1: Define eight categories: work, learning, health, social, home, outdoors, creativity, and entertainment**
- [ ] **Step 2: Add at least eight activities per category, with stable IDs and at least two good and two bad messages per activity**
- [ ] **Step 3: Type the content with `as const satisfies readonly FortuneContentDefinition[]`**

### Task 4: Implement fortune v2

**Files:**

- Replace: `src/almanac/fortune.ts`
- Modify: `src/almanac/fortune.test.ts`

- [ ] **Step 1: Derive a deterministic random stream from the ISO date and `acer-almanac:fortune:v2` namespace**
- [ ] **Step 2: Derive weekday/weekend and seasonal category weights from the selected date**
- [ ] **Step 3: Select 2-4 good and 2-4 bad activities without replacement, reduce repeated-category weight, and select message variants independently**
- [ ] **Step 4: Shuffle image IDs 1-54 and assign one unique image to every selected item**
- [ ] **Step 5: Add tests for deterministic output, no duplicates, category breadth, all image bounds, and at least 350 unique results in a leap year**

### Task 5: Version the facade and switch the component

**Files:**

- Modify: `src/almanac/almanac.ts`
- Modify: `src/almanac/index.ts`
- Modify: `src/almanac/types.ts`
- Modify: `src/components/acer-almanac.ts`
- Modify: `src/components/acer-almanac.test.ts`

- [ ] **Step 1: Add `AlmanacOptions` with `fortuneVersion?: "v1" | "v2"` and default it to `v2`**
- [ ] **Step 2: Add optional category metadata to v2 fortune items without changing v1 serialized output**
- [ ] **Step 3: Render the Chinese category label next to v2 activity names**
- [ ] **Step 4: Verify `createAlmanac(date, birthday, { fortuneVersion: "v1" })` reproduces the historical fixture**

### Task 6: Quantitative and product validation

**Files:**

- Modify: `README.md`
- Modify only implementation files identified by validation failures.

- [ ] **Step 1: Run a 1900-2099 distribution audit and verify activity frequency spread improves materially over v1**
- [ ] **Step 2: Run `vp check`, `vp test`, and `vp build`**
- [ ] **Step 3: Verify the Lit component in desktop and 390px browser viewports, including category tags and date changes**
- [ ] **Step 4: Document v1 compatibility and v2 default behavior in the README**
