const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const STORAGE_KEYS = { saved: "weather-tracker.saved-cities", last: "weather-tracker.last-city" };

const el = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#city-input"),
  geo: document.querySelector("#geo-button"),
  status: document.querySelector("#status"),
  results: document.querySelector("#search-results"),
  heading: document.querySelector("#current-heading"),
  save: document.querySelector("#save-button"),
  current: document.querySelector("#current-weather"),
  details: document.querySelector("#weather-details"),
  hourly: document.querySelector("#hourly-forecast"),
  daily: document.querySelector("#daily-forecast"),
  saved: document.querySelector("#saved-cities"),
};

const stored = loadJSON(STORAGE_KEYS.saved, []);
const state = {
  active: loadJSON(STORAGE_KEYS.last, null),
  saved: Array.isArray(stored) ? stored : [],
  results: [],
};

const fmtDay = new Intl.DateTimeFormat("uk-UA", { weekday: "long" });
const fmtHour = new Intl.DateTimeFormat("uk-UA", { hour: "2-digit", minute: "2-digit" });
const fmtFull = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

// Weather code groups: [codes[], label, icon, nightIcon?]
const WEATHER_CODES = {};
[
  [[1, 2], "Мінлива хмарність", "🌤️", "☁️"],
  [[3], "Похмуро", "☁️"],
  [[45, 48], "Туман", "🌫️"],
  [[51, 53, 55, 56, 57], "Мряка", "🌦️"],
  [[61, 63, 65, 66, 67, 80, 81, 82], "Дощ", "🌧️"],
  [[71, 73, 75, 77, 85, 86], "Сніг", "🌨️"],
  [[95, 96, 99], "Гроза", "⛈️"],
].forEach(([codes, label, icon, nightIcon]) => {
  for (const c of codes) WEATHER_CODES[c] = { label, icon, nightIcon };
});

const FALLBACK = {
  name: "Paris", admin1: "Ile-de-France", country: "France",
  latitude: 48.8566, longitude: 2.3522, timezone: "Europe/Paris",
};

boot();

function boot() {
  renderSavedCities();
  el.form.addEventListener("submit", onSearch);
  el.geo.addEventListener("click", onGeo);
  el.save.addEventListener("click", toggleSave);
  el.results.addEventListener("click", onResultClick);
  el.saved.addEventListener("click", onSavedClick);

  const loc = state.active || state.saved[0] || FALLBACK;
  loadWeather(loc, `Завантажую стартову погоду для ${locationLabel(loc)}...`);
}

async function onSearch(e) {
  e.preventDefault();
  const q = el.input.value.trim();
  if (!q) return setStatus("Введіть назву міста для пошуку.", "error");

  setStatus(`Шукаю місто "${q}"...`);
  try {
    const results = await searchCities(q);
    state.results = results;
    renderResults();
    if (!results.length) return setStatus("Місто не знайдено. Спробуйте іншу назву.", "error");
    setStatus("Оберіть потрібне місто зі списку.", "success");
    await loadWeather(results[0]);
  } catch (err) {
    setStatus(errMsg(err), "error");
  }
}

async function onGeo() {
  if (!navigator.geolocation) return setStatus("Браузер не підтримує геолокацію.", "error");
  setStatus("Отримую координати...");
  try {
    const { coords } = await new Promise((ok, no) =>
      navigator.geolocation.getCurrentPosition(ok, no, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }),
    );
    await loadWeather({
      name: "Поточне місце",
      admin1: `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
      country: "", latitude: coords.latitude, longitude: coords.longitude, timezone: "auto",
    });
  } catch (err) {
    setStatus(errMsg(err), "error");
  }
}

async function onResultClick(e) {
  const btn = e.target.closest("[data-i]");
  if (!btn) return;
  const loc = state.results[+btn.dataset.i];
  if (loc) await loadWeather(loc);
}

function onSavedClick(e) {
  const sel = e.target.closest("[data-sel]");
  const rem = e.target.closest("[data-rem]");
  if (sel) {
    const loc = state.saved.find((l) => locId(l) === sel.dataset.sel);
    if (loc) loadWeather(loc);
  } else if (rem) {
    state.saved = state.saved.filter((l) => locId(l) !== rem.dataset.rem);
    persist();
    renderSavedCities();
    updateSaveBtn();
    setStatus("Місто прибрано зі збережених.", "success");
  }
}

async function loadWeather(loc, msg) {
  setStatus(msg || `Завантажую погоду для ${locationLabel(loc)}...`);
  el.save.disabled = true;
  try {
    const w = await fetchWeather(loc);
    state.active = loc;
    persist();
    el.heading.textContent = locationLabel(loc);
    renderCurrent(loc, w);
    renderDetails(w);
    renderHourly(w);
    renderDaily(w);
    updateSaveBtn();
    setStatus(`Оновлено ${fmtFull.format(new Date())}.`, "success");
  } catch (err) {
    setStatus(errMsg(err), "error");
    updateSaveBtn();
  }
}

function renderCurrent(loc, w) {
  const m = weatherMeta(w.current.weather_code, w.current.is_day === 1);
  el.current.classList.remove("empty-state");
  el.current.innerHTML = `
    <div class="current-weather__layout">
      <div class="current-weather__icon" aria-hidden="true">${m.icon}</div>
      <div>
        <p class="current-weather__temp">${Math.round(w.current.temperature_2m)}°C</p>
        <p class="current-weather__desc">${esc(m.label)}</p>
        <div class="current-weather__meta">
          <span>${esc(loc.timezone || w.timezone)}</span>
          <span>${fmtFull.format(new Date(w.current.time))}</span>
        </div>
      </div>
    </div>`;
}

function renderDetails(w) {
  const items = [
    ["Відчувається як", `${Math.round(w.current.apparent_temperature)}°C`],
    ["Вологість", `${Math.round(w.current.relative_humidity_2m)}%`],
    ["Вітер", `${Math.round(w.current.wind_speed_10m)} км/год`],
    ["Опади сьогодні", `${round1(w.daily.precipitation_sum[0] ?? 0)} мм`],
    ["Схід сонця", fmtHour.format(new Date(w.daily.sunrise[0]))],
    ["Захід сонця", fmtHour.format(new Date(w.daily.sunset[0]))],
  ];
  el.details.classList.remove("empty-state");
  el.details.innerHTML = items
    .map(([label, value]) => `
      <article class="detail-card">
        <span class="detail-card__label">${label}</span>
        <span class="detail-card__value">${value}</span>
      </article>`)
    .join("");
}

function renderHourly(w) {
  // FIX: truncate current time to the hour so indexOf matches hourly slots
  const nowHour = w.current.time.slice(0, 14) + "00";
  const idx = Math.max(0, w.hourly.time.indexOf(nowHour));

  el.hourly.classList.remove("empty-state");
  el.hourly.innerHTML = w.hourly.time
    .slice(idx, idx + 12)
    .map((t, i) => {
      const j = idx + i;
      const m = weatherMeta(w.hourly.weather_code[j], true);
      return `
        <article class="hourly-card">
          <span class="hourly-card__time">${fmtHour.format(new Date(t))}</span>
          <span class="hourly-card__icon" aria-hidden="true">${m.icon}</span>
          <span class="hourly-card__temp">${Math.round(w.hourly.temperature_2m[j])}°C</span>
          <span class="hourly-card__rain">Опади: ${Math.round(w.hourly.precipitation_probability[j] ?? 0)}%</span>
        </article>`;
    })
    .join("");
}

function renderDaily(w) {
  el.daily.classList.remove("empty-state");
  el.daily.innerHTML = w.daily.time
    .map((t, i) => {
      const m = weatherMeta(w.daily.weather_code[i], true);
      return `
        <article class="daily-row">
          <span class="daily-row__label">${dayLabel(t, i)}</span>
          <span class="daily-row__icon" aria-hidden="true">${m.icon}</span>
          <span class="daily-row__desc">${esc(m.label)}</span>
          <span class="daily-row__temps">${Math.round(w.daily.temperature_2m_max[i])}° / ${Math.round(w.daily.temperature_2m_min[i])}°</span>
        </article>`;
    })
    .join("");
}

function renderResults() {
  if (!state.results.length) { el.results.innerHTML = ""; return; }
  el.results.innerHTML = state.results
    .map((l, i) => `
      <button class="result-button" type="button" data-i="${i}">
        ${esc(l.name)}
        <span class="result-button__meta">${l.admin1 ? esc(l.admin1) + ", " : ""}${esc(l.country)}</span>
      </button>`)
    .join("");
}

function renderSavedCities() {
  if (!state.saved.length) {
    el.saved.className = "saved-cities empty-state";
    el.saved.textContent = 'Ще немає збережених міст. Відкрийте місто й натисніть "Зберегти".';
    return;
  }
  el.saved.className = "saved-cities";
  el.saved.innerHTML = state.saved
    .map((l) => {
      const id = locId(l);
      return `
        <article class="saved-city">
          <button class="saved-city__main" type="button" data-sel="${esc(id)}">
            <span class="saved-city__title">${esc(l.name)}</span>
            <span class="saved-city__meta">${l.admin1 ? esc(l.admin1) + ", " : ""}${esc(l.country)}</span>
          </button>
          <button class="saved-city__remove" type="button" data-rem="${esc(id)}" aria-label="Видалити ${esc(l.name)}">×</button>
        </article>`;
    })
    .join("");
}

function updateSaveBtn() {
  if (!state.active) { el.save.textContent = "Зберегти"; el.save.disabled = true; return; }
  const saved = state.saved.some((l) => locId(l) === locId(state.active));
  el.save.disabled = false;
  el.save.textContent = saved ? "Прибрати" : "Зберегти";
}

function toggleSave() {
  if (!state.active) return;
  const id = locId(state.active);
  const isSaved = state.saved.some((l) => locId(l) === id);
  if (isSaved) {
    state.saved = state.saved.filter((l) => locId(l) !== id);
    setStatus("Місто прибрано зі збережених.", "success");
  } else {
    state.saved = [state.active, ...state.saved].slice(0, 6);
    setStatus("Місто додано до збережених.", "success");
  }
  persist();
  renderSavedCities();
  updateSaveBtn();
}

// --- API ---

async function searchCities(q) {
  const url = new URL(`${GEOCODE_URL}/search`);
  url.search = new URLSearchParams({ name: q, count: 5, language: "uk", format: "json" });
  const data = await fetchJSON(url);
  return (data.results || []).map((l) => ({
    name: l.name, admin1: l.admin1 || "", country: l.country || "",
    latitude: l.latitude, longitude: l.longitude, timezone: l.timezone || "auto",
  }));
}

async function fetchWeather(loc) {
  const url = new URL(WEATHER_URL);
  url.search = new URLSearchParams({
    latitude: loc.latitude, longitude: loc.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    hourly: "temperature_2m,weather_code,precipitation_probability",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum",
    timezone: "auto", forecast_days: 7,
  });
  return fetchJSON(url);
}

// --- Helpers ---

function weatherMeta(code, isDay) {
  if (code === 0) return isDay ? { label: "Ясно", icon: "☀️" } : { label: "Ясна ніч", icon: "🌙" };
  const e = WEATHER_CODES[code];
  if (!e) return { label: "Невідомо", icon: "🌡️" };
  return !isDay && e.nightIcon ? { label: e.label, icon: e.nightIcon } : { label: e.label, icon: e.icon };
}

function locId(l) {
  return `${l.name}-${Number(l.latitude).toFixed(3)}-${Number(l.longitude).toFixed(3)}`;
}

function locationLabel(l) {
  return [l.name, l.admin1, l.country].filter(Boolean).join(", ");
}

function dayLabel(date, i) {
  if (i === 0) return "Сьогодні";
  if (i === 1) return "Завтра";
  const s = fmtDay.format(new Date(date));
  return s[0].toUpperCase() + s.slice(1);
}

function setStatus(msg, level = "info") {
  el.status.dataset.state = level;
  el.status.textContent = msg;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function round1(v) { return Math.round(v * 10) / 10; }

function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function persist() {
  localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(state.saved));
  localStorage.setItem(STORAGE_KEYS.last, JSON.stringify(state.active));
}

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Сервіс погоди тимчасово недоступний.");
  return r.json();
}

function errMsg(err) {
  if (err?.code === 1) return "Доступ до геолокації заблоковано. Введіть місто вручну.";
  if (err?.code === 2) return "Не вдалося визначити місцезнаходження.";
  if (err?.code === 3) return "Геолокація зайняла забагато часу.";
  return err?.message || "Щось пішло не так. Спробуйте повторити.";
}
