import "./newletter";
import "./dest";
import "./sidebar";
import "./slider";

import searchItemTemplate from "./templates/search-item.hbs";

const API_BASE = "http://localhost:3001";

const cardsContainer = document.querySelector(".search-list");
const templateInput = document.querySelector("[data-filter-template]");
const searchForm = document.getElementById("search-form");

// Filter groups used for matching
const FILTER_TYPES = [
  "country",
  "holiday",
  "level",
  "accommodation",
  "activity",
];

// Maps the sidebar list names (data-filter-list) and the top selects
// (data-field) to a filter group above
const SIDEBAR_TO_GROUP = {
  destination: "country",
  holiday: "holiday",
  level: "level",
  accommodation: "accommodation",
  activity: "activity",
};

const SELECT_TO_GROUP = {
  destination: "country",
  type: "holiday",
  level: "level",
};

let allDestinations = [];
let allCountries = [];
let allCategories = [];

/* ---------- Data loading ---------- */

async function load(path) {
  const res = await fetch(`${API_BASE}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(`${path}: expected an array`);
  return data;
}

async function loadSafe(path) {
  try {
    return await load(path);
  } catch (error) {
    console.error("Caricamento fallito ->", error.message);
    return [];
  }
}

async function init() {
  const [
    destinations,
    categories,
    countries,
    levels,
    accommodations,
    activities,
  ] = await Promise.all([
    loadSafe("destinations"),
    loadSafe("categories"),
    loadSafe("countries"),
    loadSafe("levels"),
    loadSafe("accommodations"),
    loadSafe("activities"),
  ]);

  allDestinations = destinations;
  allCategories = categories;
  allCountries = countries;

  populateFilters("destination", countries);
  populateFilters("holiday", categories);
  populateFilters("level", levels);
  populateFilters("accommodation", accommodations);
  populateFilters("activity", activities);

  populateSelects({ destination: countries, type: categories, level: levels });

  renderCards(allDestinations);
}

/* ---------- Sidebar checkboxes ---------- */

function populateFilters(type, items) {
  const listEl = document.querySelector(`[data-filter-list="${type}"]`);
  if (!listEl || !templateInput) return;

  listEl.innerHTML = "";

  items.forEach((item) => {
    const clone = templateInput.content.cloneNode(true);
    const input = clone.querySelector("input");
    const label = clone.querySelector(".filters__label");

    input.name = type;
    input.dataset.filterType = type;
    input.value = item.id;
    label.textContent = item.name || item.nameEn;

    input.addEventListener("change", applyFilters);
    listEl.appendChild(clone);
  });
}

/* ---------- Top selects ---------- */

function populateSelects(sources) {
  document.querySelectorAll("[data-field]").forEach((select) => {
    const items = sources[select.dataset.field];
    if (!items) return;

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name || item.nameEn;
      select.appendChild(option);
    });

    select.addEventListener("change", applyFilters);
  });
}

/* ---------- Filtering ---------- */

function applyFilters() {
  const selected = Object.fromEntries(FILTER_TYPES.map((t) => [t, []]));

  // Sidebar checkboxes
  document.querySelectorAll(".filters__input:checked").forEach((input) => {
    const type = input.dataset.filterType || input.name;
    const group = SIDEBAR_TO_GROUP[type];
    if (group) selected[group].push(input.value);
  });

  // Top selects feed the same groups as the checkboxes
  document.querySelectorAll("[data-field]").forEach((select) => {
    const group = SELECT_TO_GROUP[select.dataset.field];
    if (select.value && group) selected[group].push(select.value);
  });

  // Within one group: OR. Between groups: AND.
  const matches = (chosen, itemValues = []) =>
    chosen.length === 0 || itemValues.some((v) => chosen.includes(v));

  const filtered = allDestinations.filter(
    (item) =>
      matches(selected.country, [item.countryId]) &&
      matches(selected.holiday, [item.categoryId]) &&
      matches(selected.level, item.levels) &&
      matches(selected.accommodation, item.accommodations) &&
      matches(selected.activity, item.activities),
  );

  renderCards(filtered);
}

/* ---------- Rendering ---------- */

function prepareCardData(item) {
  const country = allCountries.find((c) => c.id === item.countryId);
  const category = allCategories.find((c) => c.id === item.categoryId);

  return {
    image: item.image || "",
    alt: item.title || item.name || "Surf card",
    badge: category ? category.name : "Surf Camp",
    locationText: country ? `${country.continent}, ${country.name}` : "",
    title: item.title || item.name || "",
  };
}

function renderCards(items) {
  if (!cardsContainer) return;

  cardsContainer.innerHTML = searchItemTemplate({
    items: items.map(prepareCardData),
  });
}

/* ---------- Events ---------- */

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });
}

init();
