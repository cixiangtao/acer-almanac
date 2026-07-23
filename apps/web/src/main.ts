import "./main.css";
import "@acer-almanac/web-component";
import type { AcerAlmanac } from "@acer-almanac/web-component";
import { parseIsoDate } from "acer-almanac";

const BIRTHDAY_STORAGE_KEY = "ACER_BIR";
const almanac = document.querySelector<AcerAlmanac>("acer-almanac");

if (almanac) {
  try {
    const birthday = localStorage.getItem(BIRTHDAY_STORAGE_KEY);
    if (birthday && parseIsoDate(birthday)) {
      almanac.birthday = birthday;
    }
  } catch {
    // Storage is optional when the component runs in a restricted context.
  }

  almanac.addEventListener("birthday-change", (event) => {
    const { birthday } = event.detail;

    if (!parseIsoDate(birthday)) return;

    try {
      localStorage.setItem(BIRTHDAY_STORAGE_KEY, birthday);
    } catch {
      // The component remains functional without persistent storage.
    }
  });
}
