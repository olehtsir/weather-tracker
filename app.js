const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const STORAGE_KEYS = {
  language: "weather-tracker.language",
  lastCity: "weather-tracker.last-city",
};

const FEATURED_CITIES = [
  {
    id: "poissy",
    name: "Poissy",
    admin1: "Ile-de-France",
    country: "France",
    latitude: 48.9298,
    longitude: 2.0495,
    timezone: "Europe/Paris",
    metaKey: "featured.metaYvelines",
  },
  {
    id: "saint-germain-en-laye",
    name: "Saint-Germain-en-Laye",
    admin1: "Ile-de-France",
    country: "France",
    latitude: 48.8972,
    longitude: 2.0930,
    timezone: "Europe/Paris",
    metaKey: "featured.metaYvelines",
  },
  {
    id: "paris",
    name: "Paris",
    admin1: "Ile-de-France",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: "Europe/Paris",
    metaKey: "featured.metaCapital",
  },
];

const TRANSLATIONS = {
  fr: {
    meta: {
      title: "Météo locale | Poissy, Saint-Germain-en-Laye, Paris et toutes les villes",
      languageLabel: "Langue",
      featuredNav: "Villes prioritaires",
    },
    hero: {
      eyebrow: "Suivi météo",
      title: "La météo des Yvelines à Paris, et partout ailleurs.",
      description:
        "Consultez les prévisions détaillées pour Poissy, Saint-Germain-en-Laye, Paris ou n'importe quelle ville dans le monde.",
      panelLabel: "Villes en priorité",
    },
    search: {
      label: "Rechercher une ville",
      placeholder: "Rechercher une ville dans le monde",
      submit: "Rechercher",
      geo: "Ma position",
      minimum: "Entrez au moins 2 caractères pour lancer une recherche.",
      noResults: "Aucune ville trouvée. Essayez un autre nom.",
      choose: "Choisissez une ville dans la liste.",
      loading: 'Recherche de "{query}"…',
    },
    featured: {
      eyebrow: "Accès rapide",
      loading: "Mise à jour des villes clés…",
      unavailable: "Données indisponibles",
      metaYvelines: "Yvelines",
      metaCapital: "Capitale",
    },
    sections: {
      currentEyebrow: "En ce moment",
      detailsEyebrow: "Détails",
      detailsTitle: "Conditions du moment",
      airEyebrow: "Environnement",
      airTitle: "Qualité de l'air",
      hourlyEyebrow: "Heure par heure",
      hourlyTitle: "12 prochaines heures",
      dailyEyebrow: "Semaine",
      dailyTitle: "7 prochains jours",
    },
    current: {
      placeholder: "Choisissez une ville pour afficher la météo.",
      updatedAt: "Mis à jour {time}",
    },
    details: {
      placeholder: "Ressenti, humidité, vent et soleil.",
      feelsLike: "Ressenti",
      humidity: "Humidité",
      wind: "Vent",
      precipitation: "Précipitations du jour",
      sunrise: "Lever du soleil",
      sunset: "Coucher du soleil",
    },
    air: {
      placeholder: "Indice européen AQI et principaux polluants.",
      title: "Indice européen AQI",
      note: "Prévision régionale mise à jour toutes les heures.",
      unavailable: "Qualité de l'air indisponible pour le moment.",
      pm25: "PM2.5",
      pm10: "PM10",
      no2: "NO₂",
      ozone: "O₃",
      good: "Bon",
      fair: "Correct",
      moderate: "Moyen",
      poor: "Dégradé",
      veryPoor: "Très dégradé",
      extremelyPoor: "Extrêmement dégradé",
    },
    hourly: {
      placeholder: "Prévisions horaires détaillées.",
      rain: "Pluie",
    },
    daily: {
      placeholder: "Prévisions quotidiennes avec températures min et max.",
      today: "Aujourd'hui",
      tomorrow: "Demain",
    },
    footer: {
      prefix: "Données météo fournies par",
    },
    status: {
      loadingWeather: "Chargement de la météo pour {city}…",
      updated: "Mis à jour le {time}.",
      geoLoading: "Localisation en cours…",
      geoDenied: "L'accès à la géolocalisation a été refusé.",
      geoUnavailable: "Impossible de déterminer votre position.",
      geoTimeout: "La géolocalisation a expiré.",
      serviceDown: "Le service météo est temporairement indisponible.",
      genericError: "Une erreur est survenue. Réessayez.",
    },
    weather: {
      clearDay: "Ensoleillé",
      clearNight: "Nuit claire",
      partlyCloudy: "Éclaircies",
      cloudy: "Couvert",
      fog: "Brouillard",
      drizzle: "Bruine",
      rain: "Pluie",
      snow: "Neige",
      thunderstorm: "Orage",
      unknown: "Conditions inconnues",
    },
  },
  en: {
    meta: {
      title: "Local weather | Poissy, Saint-Germain-en-Laye, Paris and every city",
      languageLabel: "Language",
      featuredNav: "Priority cities",
    },
    hero: {
      eyebrow: "Weather tracker",
      title: "Weather from Yvelines to Paris, and any city you need.",
      description:
        "Check detailed forecasts for Poissy, Saint-Germain-en-Laye, Paris, or any other city worldwide.",
      panelLabel: "Priority cities",
    },
    search: {
      label: "Search for a city",
      placeholder: "Search any city worldwide",
      submit: "Search",
      geo: "My location",
      minimum: "Enter at least 2 characters to search.",
      noResults: "No cities found. Try another name.",
      choose: "Choose a city from the list.",
      loading: 'Searching for "{query}"…',
    },
    featured: {
      eyebrow: "Quick access",
      loading: "Refreshing the key cities…",
      unavailable: "Data unavailable",
      metaYvelines: "Yvelines",
      metaCapital: "Capital",
    },
    sections: {
      currentEyebrow: "Right now",
      detailsEyebrow: "Details",
      detailsTitle: "Current conditions",
      airEyebrow: "Environment",
      airTitle: "Air quality",
      hourlyEyebrow: "Hour by hour",
      hourlyTitle: "Next 12 hours",
      dailyEyebrow: "Week ahead",
      dailyTitle: "Next 7 days",
    },
    current: {
      placeholder: "Choose a city to display the weather.",
      updatedAt: "Updated {time}",
    },
    details: {
      placeholder: "Feels like, humidity, wind, and sunshine.",
      feelsLike: "Feels like",
      humidity: "Humidity",
      wind: "Wind",
      precipitation: "Today's precipitation",
      sunrise: "Sunrise",
      sunset: "Sunset",
    },
    air: {
      placeholder: "European AQI and the main pollutants.",
      title: "European AQI",
      note: "Regional forecast refreshed every hour.",
      unavailable: "Air quality is unavailable right now.",
      pm25: "PM2.5",
      pm10: "PM10",
      no2: "NO₂",
      ozone: "O₃",
      good: "Good",
      fair: "Fair",
      moderate: "Moderate",
      poor: "Poor",
      veryPoor: "Very poor",
      extremelyPoor: "Extremely poor",
    },
    hourly: {
      placeholder: "Detailed hourly forecast.",
      rain: "Rain",
    },
    daily: {
      placeholder: "Daily forecast with min and max temperatures.",
      today: "Today",
      tomorrow: "Tomorrow",
    },
    footer: {
      prefix: "Weather data powered by",
    },
    status: {
      loadingWeather: "Loading weather for {city}…",
      updated: "Updated on {time}.",
      geoLoading: "Getting your location…",
      geoDenied: "Geolocation access was denied.",
      geoUnavailable: "Unable to determine your location.",
      geoTimeout: "Geolocation timed out.",
      serviceDown: "The weather service is temporarily unavailable.",
      genericError: "Something went wrong. Please try again.",
    },
    weather: {
      clearDay: "Sunny",
      clearNight: "Clear night",
      partlyCloudy: "Partly cloudy",
      cloudy: "Cloudy",
      fog: "Fog",
      drizzle: "Drizzle",
      rain: "Rain",
      snow: "Snow",
      thunderstorm: "Thunderstorm",
      unknown: "Unknown conditions",
    },
  },
};

const WEATHER_GROUPS = [
  { codes: [1, 2], key: "partlyCloudy", icon: "🌤️", nightIcon: "☁️" },
  { codes: [3], key: "cloudy", icon: "☁️" },
  { codes: [45, 48], key: "fog", icon: "🌫️" },
  { codes: [51, 53, 55, 56, 57], key: "drizzle", icon: "🌦️" },
  { codes: [61, 63, 65, 66, 67, 80, 81, 82], key: "rain", icon: "🌧️" },
  { codes: [71, 73, 75, 77, 85, 86], key: "snow", icon: "🌨️" },
  { codes: [95, 96, 99], key: "thunderstorm", icon: "⛈️" },
];

const WEATHER_CODES = {};
for (const group of WEATHER_GROUPS) {
  for (const code of group.codes) WEATHER_CODES[code] = group;
}

const el = {
  heading: document.querySelector("#current-heading"),
  status: document.querySelector("#status"),
  form: document.querySelector("#search-form"),
  input: document.querySelector("#city-input"),
  geo: document.querySelector("#geo-button"),
  searchResults: document.querySelector("#search-results"),
  cityTabs: document.querySelector("#city-tabs"),
  featuredOverview: document.querySelector("#featured-overview"),
  langSwitch: document.querySelector("#lang-switch"),
  current: document.querySelector("#current-weather"),
  details: document.querySelector("#weather-details"),
  air: document.querySelector("#air-quality"),
  hourly: document.querySelector("#hourly-forecast"),
  daily: document.querySelector("#daily-forecast"),
};

const state = {
  lang: loadLanguage(),
  activeLocation: loadLocation() || FEATURED_CITIES[0],
  weather: null,
  air: null,
  searchResults: [],
  featuredWeather: new Map(),
};

boot();

async function boot() {
  renderStaticText();
  renderFeaturedOverviewLoading();

  el.form.addEventListener("submit", onSearch);
  el.geo.addEventListener("click", onGeo);
  el.cityTabs.addEventListener("click", onFeaturedClick);
  el.searchResults.addEventListener("click", onSearchResultClick);
  el.langSwitch.addEventListener("click", onLanguageClick);
  el.featuredOverview.addEventListener("click", onFeaturedClick);

  activateCityControls();

  void loadFeaturedOverview();
  await loadWeather(state.activeLocation);
}

async function onSearch(event) {
  event.preventDefault();
  const query = el.input.value.trim();
  if (query.length < 2) {
    setStatus(t("search.minimum"), "error");
    return;
  }

  setStatus(interpolate(t("search.loading"), { query }));
  try {
    state.searchResults = await searchCities(query);
    renderResults();

    if (!state.searchResults.length) {
      setStatus(t("search.noResults"), "error");
      return;
    }

    setStatus(t("search.choose"), "success");
  } catch (error) {
    setStatus(errMsg(error), "error");
  }
}

async function onGeo() {
  if (!navigator.geolocation) {
    setStatus(t("status.geoUnavailable"), "error");
    return;
  }

  setStatus(t("status.geoLoading"));
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      });
    });

    const { latitude, longitude } = position.coords;
    state.searchResults = [];
    renderResults();
    el.input.value = "";
    await loadWeather({
      id: "current-location",
      name: state.lang === "fr" ? "Position actuelle" : "Current location",
      admin1: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      country: "",
      latitude,
      longitude,
      timezone: "auto",
    });
  } catch (error) {
    setStatus(errMsg(error), "error");
  }
}

async function onFeaturedClick(event) {
  const button = event.target.closest("[data-city]");
  if (!button) return;

  const location = FEATURED_CITIES.find((city) => city.id === button.dataset.city);
  if (!location) return;

  state.searchResults = [];
  renderResults();
  el.input.value = "";
  await loadWeather(location);
}

async function onSearchResultClick(event) {
  const button = event.target.closest("[data-index]");
  if (!button) return;

  const location = state.searchResults[Number(button.dataset.index)];
  if (!location) return;

  await loadWeather(location);
  state.searchResults = [];
  renderResults();
}

function onLanguageClick(event) {
  const button = event.target.closest("[data-lang]");
  if (!button || button.dataset.lang === state.lang) return;

  state.lang = button.dataset.lang;
  localStorage.setItem(STORAGE_KEYS.language, state.lang);

  if (state.activeLocation?.id === "current-location") {
    state.activeLocation = {
      ...state.activeLocation,
      name: state.lang === "fr" ? "Position actuelle" : "Current location",
    };
    persistLocation(state.activeLocation);
  }

  renderStaticText();
  renderResults();
  renderFeaturedOverview();
  activateCityControls();

  if (state.weather) {
    renderWeatherPanels();
    setStatus(interpolate(t("status.updated"), { time: formatFull(state.weather.current.time) }), "success");
  }
}

async function loadWeather(location) {
  const normalized = normalizeLocation(location);
  state.activeLocation = normalized;
  persistLocation(normalized);
  activateCityControls();

  setStatus(interpolate(t("status.loadingWeather"), { city: locationLabel(normalized) }));

  try {
    const [weather, air] = await Promise.all([
      fetchWeather(normalized),
      fetchAirQuality(normalized),
    ]);

    state.weather = weather;
    state.air = air;
    renderWeatherPanels();
    setStatus(interpolate(t("status.updated"), { time: formatFull(weather.current.time) }), "success");
  } catch (error) {
    setStatus(errMsg(error), "error");
  }
}

async function loadFeaturedOverview() {
  try {
    const data = await Promise.all(
      FEATURED_CITIES.map(async (city) => {
        const summary = await fetchFeaturedSummary(city);
        return [city.id, summary];
      }),
    );

    state.featuredWeather = new Map(data);
  } catch {
    state.featuredWeather = new Map();
  }

  renderFeaturedOverview();
}

function renderStaticText() {
  document.documentElement.lang = state.lang;
  document.title = t("meta.title");
  el.langSwitch.setAttribute("aria-label", t("meta.languageLabel"));
  el.cityTabs.setAttribute("aria-label", t("meta.featuredNav"));

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-feature-meta]").forEach((node) => {
    const city = FEATURED_CITIES.find((item) => item.id === node.dataset.featureMeta);
    if (city) node.textContent = t(city.metaKey);
  });

  document.querySelectorAll("[data-lang]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.lang === state.lang);
  });

  if (!state.weather) {
    el.heading.textContent = locationLabel(state.activeLocation);
  }
}

function renderResults() {
  if (!state.searchResults.length) {
    el.searchResults.innerHTML = "";
    return;
  }

  el.searchResults.innerHTML = state.searchResults
    .map((location, index) => `
      <button class="result-button" type="button" data-index="${index}">
        <span class="result-button__title">${esc(location.name)}</span>
        <span class="result-button__meta">${esc(locationLabel(location))}</span>
      </button>
    `)
    .join("");
}

function renderFeaturedOverviewLoading() {
  el.featuredOverview.innerHTML = `
    <div class="empty-state">${esc(t("featured.loading"))}</div>
  `;
}

function renderFeaturedOverview() {
  el.featuredOverview.innerHTML = FEATURED_CITIES
    .map((city) => {
      const summary = state.featuredWeather.get(city.id);
      const isActive = state.activeLocation?.id === city.id;
      const meta = summary
        ? weatherMeta(summary.current.weather_code, summary.current.is_day === 1)
        : null;

      return `
        <button class="featured-city ${isActive ? "is-active" : ""}" type="button" data-city="${city.id}">
          <span class="featured-city__name">${esc(city.name)}</span>
          <span class="featured-city__meta">${esc(t(city.metaKey))}</span>
          <span class="featured-city__temp">${summary ? `${Math.round(summary.current.temperature_2m)}°C` : "—"}</span>
          <span class="featured-city__desc">${summary ? esc(meta.label) : esc(t("featured.unavailable"))}</span>
        </button>
      `;
    })
    .join("");
}

function renderWeatherPanels() {
  el.heading.textContent = locationLabel(state.activeLocation);
  renderCurrent();
  renderDetails();
  renderAir();
  renderHourly();
  renderDaily();
}

function renderCurrent() {
  const weather = state.weather;
  const current = weather.current;
  const meta = weatherMeta(current.weather_code, current.is_day === 1);

  el.current.classList.remove("empty-state");
  el.current.innerHTML = `
    <div class="current-weather__layout">
      <div class="current-weather__icon" aria-hidden="true">${meta.icon}</div>
      <div class="current-weather__content">
        <p class="current-weather__temp">${Math.round(current.temperature_2m)}°C</p>
        <p class="current-weather__desc">${esc(meta.label)}</p>
        <div class="current-weather__meta">
          <span>${esc(state.activeLocation.timezone || weather.timezone)}</span>
          <span>${esc(interpolate(t("current.updatedAt"), { time: formatFull(current.time) }))}</span>
        </div>
      </div>
    </div>
  `;
}

function renderDetails() {
  const weather = state.weather;
  const cards = [
    [t("details.feelsLike"), `${Math.round(weather.current.apparent_temperature)}°C`],
    [t("details.humidity"), `${Math.round(weather.current.relative_humidity_2m)}%`],
    [t("details.wind"), `${Math.round(weather.current.wind_speed_10m)} km/h`],
    [t("details.precipitation"), `${formatNumber(weather.daily.precipitation_sum[0] ?? 0)} mm`],
    [t("details.sunrise"), formatHour(weather.daily.sunrise[0])],
    [t("details.sunset"), formatHour(weather.daily.sunset[0])],
  ];

  el.details.classList.remove("empty-state");
  el.details.innerHTML = cards
    .map(([label, value]) => `
      <article class="detail-card">
        <span class="detail-card__label">${esc(label)}</span>
        <span class="detail-card__value">${esc(value)}</span>
      </article>
    `)
    .join("");
}

function renderAir() {
  const current = state.air?.current;
  if (!current) {
    el.air.className = "empty-state";
    el.air.textContent = t("air.unavailable");
    return;
  }

  const aqi = current.european_aqi == null ? Number.NaN : Number(current.european_aqi);
  const level = airLevel(aqi);
  const units = state.air.current_units || {};
  const pollutantCards = [
    [t("air.pm25"), current.pm2_5, units.pm2_5 || "µg/m³"],
    [t("air.pm10"), current.pm10, units.pm10 || "µg/m³"],
    [t("air.no2"), current.nitrogen_dioxide, units.nitrogen_dioxide || "µg/m³"],
    [t("air.ozone"), current.ozone, units.ozone || "µg/m³"],
  ];

  el.air.className = "air-quality";
  el.air.innerHTML = `
    <div class="air-quality__hero">
      <div>
        <p class="air-quality__label">${esc(t("air.title"))}</p>
        <div class="air-quality__value-row">
          <strong class="air-quality__value">${Number.isFinite(aqi) ? Math.round(aqi) : "—"}</strong>
          <span class="aqi-badge aqi-badge--${level.tone}">${esc(level.label)}</span>
        </div>
      </div>
      <p class="air-quality__note">${esc(t("air.note"))}</p>
    </div>
    <div class="air-quality__grid">
      ${pollutantCards
        .map(([label, value, unit]) => `
          <article class="pollutant-card">
            <span class="pollutant-card__label">${esc(label)}</span>
            <span class="pollutant-card__value">${formatPollutant(value)}</span>
            <span class="pollutant-card__unit">${esc(unit)}</span>
          </article>
        `)
        .join("")}
    </div>
  `;
}

function renderHourly() {
  const weather = state.weather;
  const nowHour = toHourlyTimestamp(weather.current.time);
  const startIndex = Math.max(0, weather.hourly.time.indexOf(nowHour));

  el.hourly.classList.remove("empty-state");
  el.hourly.innerHTML = weather.hourly.time
    .slice(startIndex, startIndex + 12)
    .map((time, offset) => {
      const index = startIndex + offset;
      const meta = weatherMeta(
        weather.hourly.weather_code[index],
        isDaylightHour(time),
      );

      return `
        <article class="hourly-card">
          <span class="hourly-card__time">${formatHour(time)}</span>
          <span class="hourly-card__icon" aria-hidden="true">${meta.icon}</span>
          <span class="hourly-card__temp">${Math.round(weather.hourly.temperature_2m[index])}°C</span>
          <span class="hourly-card__rain">${esc(t("hourly.rain"))}: ${Math.round(weather.hourly.precipitation_probability[index] ?? 0)}%</span>
        </article>
      `;
    })
    .join("");
}

function renderDaily() {
  const weather = state.weather;

  el.daily.classList.remove("empty-state");
  el.daily.innerHTML = weather.daily.time
    .map((date, index) => {
      const meta = weatherMeta(weather.daily.weather_code[index], true);
      return `
        <article class="daily-row">
          <div class="daily-row__primary">
            <span class="daily-row__label">${esc(dayLabel(date, index))}</span>
            <span class="daily-row__desc">${esc(meta.label)}</span>
          </div>
          <div class="daily-row__secondary">
            <span class="daily-row__icon" aria-hidden="true">${meta.icon}</span>
            <span class="daily-row__temps">${Math.round(weather.daily.temperature_2m_max[index])}° / ${Math.round(weather.daily.temperature_2m_min[index])}°</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function activateCityControls() {
  document.querySelectorAll("[data-city]").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.city === state.activeLocation?.id);
  });
}

async function searchCities(query) {
  const url = new URL(GEOCODE_URL);
  url.search = new URLSearchParams({
    name: query,
    count: 8,
    language: state.lang,
    format: "json",
  });

  const data = await fetchJSON(url);
  return (data.results || []).map((location) => normalizeLocation({
    name: location.name,
    admin1: location.admin1 || "",
    country: location.country || "",
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone || "auto",
  }));
}

async function fetchWeather(location) {
  const url = new URL(WEATHER_URL);
  url.search = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    hourly: "temperature_2m,weather_code,precipitation_probability",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum",
    timezone: "auto",
    forecast_days: 7,
  });

  return fetchJSON(url);
}

async function fetchAirQuality(location) {
  const url = new URL(AIR_QUALITY_URL);
  url.search = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone",
    timezone: "auto",
  });

  return fetchJSON(url);
}

async function fetchFeaturedSummary(location) {
  const url = new URL(WEATHER_URL);
  url.search = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,weather_code,is_day",
    timezone: location.timezone || "auto",
    forecast_days: 1,
  });

  return fetchJSON(url);
}

function weatherMeta(code, isDay) {
  if (code === 0) {
    return isDay
      ? { label: t("weather.clearDay"), icon: "☀️" }
      : { label: t("weather.clearNight"), icon: "🌙" };
  }

  const entry = WEATHER_CODES[code];
  if (!entry) return { label: t("weather.unknown"), icon: "🌡️" };

  const icon = !isDay && entry.nightIcon ? entry.nightIcon : entry.icon;
  return { label: t(`weather.${entry.key}`), icon };
}

function airLevel(value) {
  if (!Number.isFinite(value)) return { label: t("air.unavailable"), tone: "unknown" };
  if (value <= 20) return { label: t("air.good"), tone: "good" };
  if (value <= 40) return { label: t("air.fair"), tone: "fair" };
  if (value <= 60) return { label: t("air.moderate"), tone: "moderate" };
  if (value <= 80) return { label: t("air.poor"), tone: "poor" };
  if (value <= 100) return { label: t("air.veryPoor"), tone: "very-poor" };
  return { label: t("air.extremelyPoor"), tone: "extreme" };
}

function dayLabel(date, index) {
  if (index === 0) return t("daily.today");
  if (index === 1) return t("daily.tomorrow");
  return capitalize(new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(new Date(date)));
}

function locationLabel(location) {
  return [location.name, location.admin1, location.country].filter(Boolean).join(", ");
}

function normalizeLocation(location) {
  const featured = FEATURED_CITIES.find((city) => isSameCity(city, location));
  return {
    id: featured?.id || location.id || locId(location),
    name: location.name,
    admin1: location.admin1 || "",
    country: location.country || "",
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    timezone: location.timezone || "auto",
  };
}

function isSameCity(a, b) {
  return Math.abs(Number(a.latitude) - Number(b.latitude)) < 0.02
    && Math.abs(Number(a.longitude) - Number(b.longitude)) < 0.02;
}

function locId(location) {
  return `${location.name}-${Number(location.latitude).toFixed(3)}-${Number(location.longitude).toFixed(3)}`;
}

function formatHour(value) {
  return new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatFull(value) {
  return new Intl.DateTimeFormat(locale(), {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatNumber(value) {
  return new Intl.NumberFormat(locale(), { maximumFractionDigits: 1 }).format(Number(value) || 0);
}

function formatPollutant(value) {
  if (value == null || value === "") return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return formatNumber(numeric);
}

function isDaylightHour(value) {
  const hour = Number(String(value).slice(11, 13));
  return hour >= 6 && hour < 21;
}

function toHourlyTimestamp(value) {
  return `${String(value).slice(0, 13)}:00`;
}

function locale() {
  return state.lang === "fr" ? "fr-FR" : "en-US";
}

function t(key) {
  return key.split(".").reduce((acc, part) => acc?.[part], TRANSLATIONS[state.lang]) || key;
}

function interpolate(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (_, token) => values[token] ?? "");
}

function setStatus(message, level = "info") {
  el.status.dataset.state = level;
  el.status.textContent = message;
}

function errMsg(error) {
  if (error?.code === 1) return t("status.geoDenied");
  if (error?.code === 2) return t("status.geoUnavailable");
  if (error?.code === 3) return t("status.geoTimeout");
  return error?.message || t("status.genericError");
}

function loadLanguage() {
  const language = localStorage.getItem(STORAGE_KEYS.language);
  return language === "en" ? "en" : "fr";
}

function loadLocation() {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.lastCity);
    return value ? normalizeLocation(JSON.parse(value)) : null;
  } catch {
    return null;
  }
}

function persistLocation(location) {
  localStorage.setItem(STORAGE_KEYS.lastCity, JSON.stringify(location));
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(t("status.serviceDown"));
  return response.json();
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function capitalize(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : value;
}
