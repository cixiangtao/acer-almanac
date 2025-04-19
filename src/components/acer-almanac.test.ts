// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { AcerAlmanac } from "./acer-almanac";

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const mountAlmanac = async () => {
  const element = new AcerAlmanac();
  element.date = "2026-07-13";
  element.birthday = "1993-01-12";
  document.body.append(element);
  await element.updateComplete;
  return element;
};

describe("acer-almanac", () => {
  it("renders the algorithm package result", async () => {
    const element = await mountAlmanac();
    const content = element.shadowRoot?.textContent;

    expect(content).toContain("2026年7月13日");
    expect(content).toContain("星期一");
    expect(content).toContain("丙午(马)年 五月廿九");
    expect(content).toContain("半吉");
    expect(content).toContain("轻松慢跑");
    expect(content).toContain("认真倾听");
  });

  it("moves to the next date and publishes a composed event", async () => {
    const element = await mountAlmanac();
    const onDateChange = vi.fn();
    element.addEventListener("date-change", onDateChange);

    element.shadowRoot?.querySelector<HTMLButtonElement>('button[data-action="next"]')?.click();
    await element.updateComplete;

    expect(element.date).toBe("2026-07-14");
    const [event] = onDateChange.mock.calls[0] as [CustomEvent<{ date: string }>];
    expect(event.detail).toEqual({ date: "2026-07-14" });
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it("validates and publishes birthday changes", async () => {
    const element = await mountAlmanac();
    const onBirthdayChange = vi.fn();
    element.addEventListener("birthday-change", onBirthdayChange);

    element.shadowRoot
      ?.querySelector<HTMLButtonElement>('button[data-action="edit-birthday"]')
      ?.click();
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector<HTMLInputElement>('input[name="birthday"]');
    if (!input) throw new Error("birthday input was not rendered");
    input.value = "";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await element.updateComplete;
    expect(input.value).toBe("");
    expect(
      element.shadowRoot?.querySelector<HTMLButtonElement>('button[data-action="save-birthday"]')
        ?.disabled,
    ).toBe(true);

    input.value = "1994-05-06";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    await element.updateComplete;

    element.shadowRoot
      ?.querySelector<HTMLButtonElement>('button[data-action="save-birthday"]')
      ?.click();
    await element.updateComplete;

    expect(element.birthday).toBe("1994-05-06");
    const [event] = onBirthdayChange.mock.calls[0] as [CustomEvent<{ birthday: string }>];
    expect(event.detail).toEqual({ birthday: "1994-05-06" });
  });
});
