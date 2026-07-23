import "./popup.css";
import "@acer-almanac/web-component";
import type { AcerAlmanac } from "@acer-almanac/web-component";
import { parseIsoDate } from "acer-almanac";

const BIRTHDAY_STORAGE_KEY = "ACER_BIR";
const almanac = document.querySelector<AcerAlmanac>("acer-almanac");
const extensionStorage = typeof chrome === "undefined" ? null : chrome.storage.local;

const loadBirthday = async () => {
  if (!almanac || !extensionStorage) return;

  const stored = await extensionStorage.get(BIRTHDAY_STORAGE_KEY);
  const birthday = stored[BIRTHDAY_STORAGE_KEY];

  if (typeof birthday === "string" && parseIsoDate(birthday)) {
    almanac.birthday = birthday;
  }
};

almanac?.addEventListener("birthday-change", ({ detail }) => {
  if (!extensionStorage || !parseIsoDate(detail.birthday)) return;
  void extensionStorage.set({ [BIRTHDAY_STORAGE_KEY]: detail.birthday });
});

void loadBirthday();
