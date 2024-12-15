# Lit Almanac Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the incomplete Vue 2 implementation with a tested TypeScript almanac package and a reusable `<acer-almanac>` Lit Web Component.

**Architecture:** Pure functions under `src/almanac` own civil-date parsing, lunar formatting, deterministic fortune selection, and birthday luck. The Lit component consumes one `createAlmanac` facade, exposes ISO date strings as attributes, and emits composed custom events; the application entry owns local-storage persistence.

**Tech Stack:** TypeScript, Lit, Intl Chinese calendar, Vite+, Vitest

---

### Task 1: Lock down civil-date behavior

**Files:**

- Create: `src/almanac/date.test.ts`
- Create: `src/almanac/date.ts`
- Create: `src/almanac/types.ts`

- [ ] **Step 1: Write failing tests for strict ISO parsing, leap days, day arithmetic, and selected-date weekdays**

```ts
expect(parseIsoDate("2024-02-29")).toEqual({ year: 2024, month: 2, day: 29 });
expect(parseIsoDate("2023-02-29")).toBeNull();
expect(addDays({ year: 2024, month: 2, day: 29 }, 1)).toEqual({ year: 2024, month: 3, day: 1 });
expect(getWeekdayLabel({ year: 2026, month: 7, day: 13 })).toBe("星期一");
```

- [ ] **Step 2: Run `vp test src/almanac/date.test.ts` and verify imports fail**
- [ ] **Step 3: Implement `CalendarDate`, strict `YYYY-MM-DD` conversion, local today, UTC-backed day arithmetic, and weekday formatting**
- [ ] **Step 4: Re-run the focused test and expect all assertions to pass**

### Task 2: Replace the expired lunar table

**Files:**

- Create: `src/almanac/lunar.test.ts`
- Create: `src/almanac/lunar.ts`

- [ ] **Step 1: Add golden tests for Lunar New Year and a current date**

```ts
expect(getLunarDate({ year: 2024, month: 2, day: 10 }).text).toBe("甲辰(龙)年 正月初一");
expect(getLunarDate({ year: 2026, month: 7, day: 13 }).text).toBe("丙午(马)年 五月廿九");
```

- [ ] **Step 2: Run the test and verify the missing module failure**
- [ ] **Step 3: Implement the formatter with `Intl.DateTimeFormat("zh-CN-u-ca-chinese", { dateStyle: "full", timeZone: "UTC" })`, extracting `relatedYear`, `yearName`, `month`, and `day` parts and deriving the zodiac from the related lunar year**
- [ ] **Step 4: Re-run the focused lunar test**

### Task 3: Restore the deterministic fortune algorithm

**Files:**

- Create: `src/almanac/fortune-data.ts`
- Create: `src/almanac/fortune.test.ts`
- Create: `src/almanac/fortune.ts`

- [ ] **Step 1: Copy the 26 tracked activity records into a readonly typed dataset and add a golden-output test for `2026-07-13`**
- [ ] **Step 2: Run the test and verify `generateFortune` is missing**
- [ ] **Step 3: Implement the historical date seed and repeated-square modulo mixer**

```ts
const seed = 37_621 * year + 539 * month + day;
let value = seed % 11_117;
for (let iteration = 0; iteration < 25 + offset; iteration += 1) {
  value = (value * value) % 11_117;
}
```

- [ ] **Step 4: Select 2-4 good and 2-4 bad activities from copied shrinking pools, and select unique image IDs from 1-50**
- [ ] **Step 5: Assert deterministic repeat calls, no duplicate activities, and no duplicate images**

### Task 4: Isolate birthday luck and the package facade

**Files:**

- Create: `src/almanac/luck.test.ts`
- Create: `src/almanac/luck.ts`
- Create: `src/almanac/almanac.test.ts`
- Create: `src/almanac/almanac.ts`
- Create: `src/almanac/index.ts`

- [ ] **Step 1: Add threshold and fixed date/birthday tests for `calculateLuck`**
- [ ] **Step 2: Implement the historical score with validated `CalendarDate` inputs and map it to the eight labels**
- [ ] **Step 3: Add a facade test proving `createAlmanac(date, birthday?)` combines ISO date, weekday, lunar date, fortune, and optional luck**
- [ ] **Step 4: Export the public package contract only from `src/almanac/index.ts`**

### Task 5: Build the Lit Web Component

**Files:**

- Create: `src/components/acer-almanac.ts`
- Create: `src/components/acer-almanac.test.ts`

- [ ] **Step 1: Define reactive string properties `date` and `birthday`, plus private birthday-editor state, without decorator compiler configuration**
- [ ] **Step 2: Render the selected date, weekday, lunar date, luck badge, and good/bad sections from `createAlmanac`**
- [ ] **Step 3: Implement previous/today/next buttons by calling `addDays`, updating `date`, and dispatching a bubbling composed `date-change` event**
- [ ] **Step 4: Implement explicit birthday editing with native date input and dispatch a bubbling composed `birthday-change` event after validation**
- [ ] **Step 5: Add Shadow DOM styles for a responsive printed-almanac card, accessible focus states, reduced motion, CSS custom properties, and exposed `part` attributes**
- [ ] **Step 6: Register `acer-almanac` and extend `HTMLElementTagNameMap`**

### Task 6: Complete the Vite+ application migration

**Files:**

- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `tsconfig.json`
- Modify: `index.html`
- Create: `src/main.ts`
- Create: `src/main.css`
- Delete: `src/main.js`
- Delete: `src/App.vue`
- Delete: `src/components/calendar.vue`
- Delete: `src/util/LunarDay.js`
- Delete: `src/util/Luck.js`
- Delete: `src/util/fortuneData.js`
- Delete: `build/**`
- Delete: `config/**`

- [ ] **Step 1: Keep `vite-plus`, replace runtime dependencies with `lit`, and add `typescript`**
- [ ] **Step 2: Configure Vite to serve the existing `static` directory as `publicDir` and configure Vitest test discovery**
- [ ] **Step 3: Replace the empty webpack HTML shell with `<acer-almanac>` and a `/src/main.ts` module entry**
- [ ] **Step 4: Read `ACER_BIR` in `main.ts`, validate it, pass it to the element, and persist future `birthday-change` details**
- [ ] **Step 5: Remove Vue, Element UI, Less, webpack, and Babel sources and dependencies**
- [ ] **Step 6: Run `vp install` to refresh `pnpm-lock.yaml`**

### Task 7: Validate the finished migration

**Files:**

- Modify only files identified by validation failures.

- [ ] **Step 1: Run `vp check --fix`, then `vp check`; expect formatting, lint, and type checks to pass**
- [ ] **Step 2: Run `vp test`; expect every algorithm and component test to pass**
- [ ] **Step 3: Run `vp build`; expect a non-empty JavaScript entry and all 54 GIF assets to remain available through `/img/`**
- [ ] **Step 4: Run the app in a browser, verify desktop and narrow viewport layouts, date navigation, birthday persistence, keyboard focus, and current lunar output**
- [ ] **Step 5: Confirm `git status --short` contains only the intended refactor plus the user's pre-existing Vite+ migration files**
