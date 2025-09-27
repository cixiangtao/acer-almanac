import { LitElement, css, html, nothing } from "lit";

import {
  addDays,
  createAlmanac,
  FORTUNE_CATEGORY_LABELS,
  formatIsoDate,
  getToday,
  parseIsoDate,
  type CalendarDate,
  type FortuneItem,
} from "../almanac";

const FORTUNE_IMAGE_URLS = import.meta.glob("../assets/fortune/*.webp", {
  eager: true,
  import: "default",
  query: "?url",
});

const getFortuneImageUrl = (image: number) => {
  const imageUrl = FORTUNE_IMAGE_URLS[`../assets/fortune/${image}.webp`];
  if (!imageUrl) throw new RangeError(`Missing fortune image: ${image}`);
  return imageUrl;
};

export interface AlmanacDateChangeDetail {
  readonly date: string;
}

export interface AlmanacBirthdayChangeDetail {
  readonly birthday: string;
}

const formatDisplayDate = ({ day, month, year }: CalendarDate) => `${year}年${month}月${day}日`;

export class AcerAlmanac extends LitElement {
  static properties = {
    _birthdayDraft: { state: true },
    _editingBirthday: { state: true },
    birthday: { reflect: true, type: String },
    date: { reflect: true, type: String },
  };

  static styles = css`
    :host {
      --almanac-accent: #b42318;
      --almanac-bad: #a9231b;
      --almanac-good: #efbd2f;
      --almanac-ink: #271d18;
      --almanac-muted: #76685d;
      --almanac-paper: #f8f0dc;
      display: block;
      max-inline-size: 760px;
      color: var(--almanac-ink);
      font-family: "FangSong", "STFangsong", "Noto Serif CJK SC", serif;
    }

    * {
      box-sizing: border-box;
    }

    button,
    input {
      font: inherit;
    }

    button {
      color: inherit;
    }

    .card {
      position: relative;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--almanac-ink) 24%, transparent);
      border-radius: 3px;
      background:
        linear-gradient(
          90deg,
          rgb(255 255 255 / 16%),
          transparent 22%,
          rgb(90 55 20 / 4%) 77%,
          transparent
        ),
        repeating-linear-gradient(0deg, transparent 0 3px, rgb(80 45 20 / 2%) 3px 4px),
        var(--almanac-paper);
      box-shadow:
        0 24px 70px rgb(69 44 24 / 18%),
        0 2px 6px rgb(69 44 24 / 12%);
      animation: card-arrival 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .card::before,
    .card::after {
      position: absolute;
      z-index: 0;
      border: 1px solid rgb(180 35 24 / 18%);
      border-radius: 999px;
      content: "";
      pointer-events: none;
    }

    .card::before {
      inset-block-start: -110px;
      inset-inline-end: -90px;
      inline-size: 260px;
      block-size: 260px;
    }

    .card::after {
      inset-block-start: -84px;
      inset-inline-end: -64px;
      inline-size: 208px;
      block-size: 208px;
    }

    .header {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 18px;
      align-items: center;
      padding: 24px 28px 20px;
      border-block-end: 1px solid rgb(39 29 24 / 18%);
    }

    .seal {
      display: grid;
      place-items: center;
      inline-size: 58px;
      block-size: 58px;
      border: 3px double var(--almanac-accent);
      color: var(--almanac-accent);
      font-family: "STKaiti", "KaiTi", serif;
      font-size: 25px;
      font-weight: 700;
      line-height: 1;
      transform: rotate(-4deg);
    }

    .eyebrow {
      margin: 0 0 4px;
      color: var(--almanac-accent);
      font-family: "DIN Condensed", "Arial Narrow", sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .date-line {
      display: flex;
      flex-wrap: wrap;
      gap: 5px 12px;
      align-items: baseline;
      margin: 0;
    }

    .date-value {
      font-family: "STKaiti", "KaiTi", serif;
      font-size: clamp(24px, 5vw, 38px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.04em;
    }

    .weekday {
      padding: 3px 8px;
      border: 1px solid currentColor;
      border-radius: 999px;
      color: var(--almanac-accent);
      font-size: 12px;
      white-space: nowrap;
    }

    .lunar {
      margin: 7px 0 0;
      color: var(--almanac-muted);
      font-size: 14px;
      letter-spacing: 0.04em;
    }

    .luck-panel {
      min-inline-size: 126px;
      text-align: center;
    }

    .luck-button {
      display: inline-grid;
      gap: 2px;
      place-items: center;
      min-inline-size: 96px;
      padding: 10px 13px;
      border: 1px solid rgb(39 29 24 / 28%);
      border-radius: 2px;
      background: rgb(255 255 255 / 24%);
      box-shadow: inset 0 0 0 2px rgb(248 240 220 / 80%);
      cursor: pointer;
    }

    .luck-label {
      font-family: "STKaiti", "KaiTi", serif;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }

    .luck-score {
      color: var(--almanac-muted);
      font-family: "DIN Condensed", "Arial Narrow", sans-serif;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .birthday-form {
      display: grid;
      gap: 7px;
      justify-items: end;
    }

    .birthday-form label {
      color: var(--almanac-muted);
      font-size: 11px;
    }

    .birthday-form input {
      inline-size: 142px;
      min-block-size: 34px;
      border: 1px solid rgb(39 29 24 / 28%);
      border-radius: 2px;
      background: rgb(255 255 255 / 46%);
      padding-inline: 8px;
      color: var(--almanac-ink);
    }

    .form-actions {
      display: flex;
      gap: 6px;
    }

    .small-button,
    .nav-button {
      min-block-size: 32px;
      border: 1px solid rgb(39 29 24 / 24%);
      border-radius: 2px;
      background: rgb(255 255 255 / 24%);
      cursor: pointer;
      transition:
        background-color 160ms ease,
        border-color 160ms ease,
        transform 160ms ease;
    }

    .small-button {
      padding-inline: 10px;
      font-size: 12px;
    }

    .small-button.primary {
      border-color: var(--almanac-accent);
      background: var(--almanac-accent);
      color: #fff8e8;
    }

    .small-button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .navigation {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: center;
      padding: 9px 18px;
      border-block-end: 1px solid rgb(39 29 24 / 14%);
      background: rgb(255 255 255 / 18%);
    }

    .nav-group {
      display: grid;
      grid-template-columns: 42px minmax(88px, auto) 42px;
      overflow: hidden;
      border: 1px solid rgb(39 29 24 / 24%);
      border-radius: 999px;
    }

    .nav-button {
      border: 0;
      border-radius: 0;
      padding-inline: 13px;
      background: transparent;
      font-family: "STKaiti", "KaiTi", serif;
    }

    .nav-button + .nav-button {
      border-inline-start: 1px solid rgb(39 29 24 / 18%);
    }

    button:hover:not(:disabled) {
      border-color: var(--almanac-accent);
      background-color: rgb(180 35 24 / 8%);
    }

    button:active:not(:disabled) {
      transform: translateY(1px);
    }

    button:focus-visible,
    input:focus-visible {
      outline: 3px solid color-mix(in srgb, var(--almanac-good) 72%, white);
      outline-offset: 2px;
    }

    .fortune-board {
      position: relative;
      z-index: 1;
      padding: 18px;
    }

    .fortune-section {
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      overflow: hidden;
      border: 1px solid rgb(39 29 24 / 20%);
    }

    .fortune-section + .fortune-section {
      margin-block-start: 12px;
    }

    .fortune-section.good {
      background: color-mix(in srgb, var(--almanac-good) 21%, var(--almanac-paper));
    }

    .fortune-section.bad {
      background: color-mix(in srgb, var(--almanac-bad) 10%, var(--almanac-paper));
    }

    .section-mark {
      display: grid;
      place-items: center;
      border-inline-end: 1px solid rgb(39 29 24 / 18%);
      font-family: "STKaiti", "KaiTi", serif;
      font-size: 48px;
      font-weight: 700;
      line-height: 1;
      text-shadow: 0 1px rgb(255 255 255 / 45%);
    }

    .good .section-mark {
      background: var(--almanac-good);
    }

    .bad .section-mark {
      background: var(--almanac-bad);
      color: #fff8e8;
      text-shadow: none;
    }

    .fortune-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .fortune-item {
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      min-block-size: 70px;
      padding: 8px 14px;
      transition:
        background-color 180ms ease,
        padding-inline-start 180ms ease;
    }

    .fortune-item + .fortune-item {
      border-block-start: 1px dashed rgb(39 29 24 / 18%);
    }

    .fortune-item:hover {
      padding-inline-start: 19px;
      background: rgb(255 255 255 / 24%);
    }

    .fortune-item img {
      display: block;
      inline-size: 48px;
      block-size: 48px;
      object-fit: contain;
    }

    .activity {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      align-items: center;
      margin: 0 0 3px;
      font-family: "STKaiti", "KaiTi", serif;
      font-size: 19px;
      font-weight: 700;
    }

    .category {
      padding: 1px 5px;
      border: 1px solid rgb(39 29 24 / 22%);
      border-radius: 999px;
      color: var(--almanac-muted);
      font-family: "FangSong", "STFangsong", serif;
      font-size: 9px;
      font-weight: 400;
      line-height: 1.3;
    }

    .description {
      margin: 0;
      color: var(--almanac-muted);
      font-size: 12px;
      line-height: 1.45;
    }

    @keyframes card-arrival {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.995);
      }
    }

    @media (max-width: 600px) {
      .header {
        grid-template-columns: auto minmax(0, 1fr);
        gap: 14px;
        padding: 20px 18px 16px;
      }

      .seal {
        inline-size: 48px;
        block-size: 48px;
        font-size: 21px;
      }

      .luck-panel {
        grid-column: 1 / -1;
        inline-size: 100%;
        text-align: start;
      }

      .luck-button {
        display: flex;
        min-inline-size: 0;
        inline-size: 100%;
        justify-content: space-between;
      }

      .birthday-form {
        grid-template-columns: 1fr auto;
        justify-items: stretch;
      }

      .birthday-form label {
        grid-column: 1 / -1;
      }

      .birthday-form input {
        inline-size: 100%;
      }

      .fortune-board {
        padding: 12px;
      }

      .fortune-section {
        grid-template-columns: 66px minmax(0, 1fr);
      }

      .section-mark {
        font-size: 36px;
      }

      .fortune-item {
        grid-template-columns: 44px minmax(0, 1fr);
        gap: 9px;
        padding-inline: 10px;
      }

      .fortune-item img {
        inline-size: 40px;
        block-size: 40px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        animation: none;
      }

      button,
      .fortune-item {
        transition: none;
      }
    }
  `;

  declare birthday: string;
  declare date: string;
  declare private _birthdayDraft: string;
  declare private _editingBirthday: boolean;

  constructor() {
    super();
    this.date = formatIsoDate(getToday());
    this.birthday = "";
    this._birthdayDraft = "";
    this._editingBirthday = false;
  }

  private get _selectedDate() {
    return parseIsoDate(this.date) ?? getToday();
  }

  private get _birthdayDate() {
    return parseIsoDate(this.birthday);
  }

  private get _canSaveBirthday() {
    const parsed = parseIsoDate(this._birthdayDraft);
    return parsed !== null && this._birthdayDraft <= formatIsoDate(getToday());
  }

  private _publish<T>(name: string, detail: T) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  private _changeDate(amount: number) {
    this.date = formatIsoDate(addDays(this._selectedDate, amount));
    this._publish<AlmanacDateChangeDetail>("date-change", { date: this.date });
  }

  private _goToday() {
    this.date = formatIsoDate(getToday());
    this._publish<AlmanacDateChangeDetail>("date-change", { date: this.date });
  }

  private _startBirthdayEdit() {
    this._birthdayDraft = this.birthday;
    this._editingBirthday = true;
  }

  private _updateBirthdayDraft(event: InputEvent) {
    this._birthdayDraft = (event.currentTarget as HTMLInputElement).value;
  }

  private _saveBirthday() {
    if (!this._canSaveBirthday) return;

    this.birthday = this._birthdayDraft;
    this._editingBirthday = false;
    this._publish<AlmanacBirthdayChangeDetail>("birthday-change", {
      birthday: this.birthday,
    });
  }

  private _renderBirthdayEditor() {
    return html`
      <div class="birthday-form" part="birthday-form">
        <label for="birthday">输入生日，生成当日运势</label>
        <input
          id="birthday"
          name="birthday"
          type="date"
          max=${formatIsoDate(getToday())}
          .value=${this._birthdayDraft}
          @input=${(event: InputEvent) => this._updateBirthdayDraft(event)}
        />
        <div class="form-actions">
          ${this._birthdayDate
            ? html`<button
                class="small-button"
                type="button"
                @click=${() => {
                  this._editingBirthday = false;
                }}
              >
                取消
              </button>`
            : nothing}
          <button
            class="small-button primary"
            data-action="save-birthday"
            type="button"
            ?disabled=${!this._canSaveBirthday}
            @click=${() => this._saveBirthday()}
          >
            确认
          </button>
        </div>
      </div>
    `;
  }

  private _renderFortuneSection(
    kind: "good" | "bad",
    label: "宜" | "忌",
    items: readonly FortuneItem[],
  ) {
    return html`
      <section class="fortune-section ${kind}" part="fortune-section ${kind}">
        <div class="section-mark" aria-hidden="true">${label}</div>
        <ul class="fortune-list" aria-label="${label}做的事">
          ${items.map(
            ({ activity, category, description, image }) => html`
              <li class="fortune-item" part="fortune-item">
                <img
                  src=${getFortuneImageUrl(image)}
                  alt=""
                  width="48"
                  height="48"
                  decoding="async"
                />
                <div>
                  <p class="activity">
                    <span>${activity}</span>
                    ${category
                      ? html`<span class="category">${FORTUNE_CATEGORY_LABELS[category]}</span>`
                      : nothing}
                  </p>
                  <p class="description">${description}</p>
                </div>
              </li>
            `,
          )}
        </ul>
      </section>
    `;
  }

  render() {
    const selectedDate = this._selectedDate;
    const almanac = createAlmanac(selectedDate, this._birthdayDate ?? undefined);
    const showBirthdayEditor = this._editingBirthday || !almanac.luck;

    return html`
      <article class="card" part="card">
        <header class="header" part="header">
          <div class="seal" aria-hidden="true">AC</div>
          <div>
            <p class="eyebrow">Acer Daily Almanac</p>
            <p class="date-line">
              <time class="date-value" datetime=${almanac.isoDate}
                >${formatDisplayDate(selectedDate)}</time
              >
              <span class="weekday">${almanac.weekday}</span>
            </p>
            <p class="lunar">${almanac.lunar.text}</p>
          </div>
          <div class="luck-panel" part="luck">
            ${showBirthdayEditor
              ? this._renderBirthdayEditor()
              : html`<button
                  class="luck-button"
                  data-action="edit-birthday"
                  type="button"
                  title="当日运势指数：${almanac.luck?.score}%（点击修改生日）"
                  @click=${() => this._startBirthdayEdit()}
                >
                  <span class="luck-label" style="color: ${almanac.luck?.color}"
                    >${almanac.luck?.label}</span
                  >
                  <span class="luck-score">运势 ${almanac.luck?.score}% · 修改生日</span>
                </button>`}
          </div>
        </header>

        <nav class="navigation" aria-label="切换日期" part="navigation">
          <div class="nav-group">
            <button
              class="nav-button"
              data-action="previous"
              type="button"
              aria-label="前一天"
              @click=${() => this._changeDate(-1)}
            >
              ←
            </button>
            <button
              class="nav-button"
              data-action="today"
              type="button"
              @click=${() => this._goToday()}
            >
              回到今日
            </button>
            <button
              class="nav-button"
              data-action="next"
              type="button"
              aria-label="后一天"
              @click=${() => this._changeDate(1)}
            >
              →
            </button>
          </div>
        </nav>

        <div class="fortune-board" aria-live="polite" part="fortune-board">
          ${this._renderFortuneSection("good", "宜", almanac.fortune.good)}
          ${this._renderFortuneSection("bad", "忌", almanac.fortune.bad)}
        </div>
      </article>
    `;
  }
}

if (!customElements.get("acer-almanac")) {
  customElements.define("acer-almanac", AcerAlmanac);
}

declare global {
  interface HTMLElementEventMap {
    "birthday-change": CustomEvent<AlmanacBirthdayChangeDetail>;
    "date-change": CustomEvent<AlmanacDateChangeDetail>;
  }

  interface HTMLElementTagNameMap {
    "acer-almanac": AcerAlmanac;
  }
}
