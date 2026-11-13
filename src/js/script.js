import "./newletter"
import "./dest"
import "./sidebar"
import "./slider"

import "./dest"
import "./sidebar"

const API_BASE = 'http://localhost:3001';

const cardsContainer = document.querySelector('.search-list');
const templateInput = document.querySelector('[data-filter-template]');
const searchForm = document.getElementById('search-form');

let allDestinations = [];
let allCountries = [];

async function init() {
  try {
    const [destRes, categoriesRes, countriesRes] = await Promise.all([
      fetch(`${API_BASE}/destinations`),
      fetch(`${API_BASE}/categories`),
      fetch(`${API_BASE}/countries`)
    ]);

    allDestinations = await destRes.json();
    const categories = await categoriesRes.json();
    allCountries = await countriesRes.json();

    populateFilters('holiday', categories);
    populateFilters('destination', allCountries);
    populateFilters('country', allCountries);

    renderCards(allDestinations);
  } catch (error) {
    console.error('Помилка завантаження даних:', error);
  }
}

function populateFilters(type, items) {
  let listEl = document.querySelector(`[data-filter-list="${type}"]`);
  if (!listEl && type === 'destination') {
    listEl = document.querySelector('[data-filter-list="country"]');
  }
  if (!listEl || !templateInput) return;

  listEl.innerHTML = '';

  items.forEach(item => {
    const clone = templateInput.content.cloneNode(true);
    const input = clone.querySelector('input');
    const label = clone.querySelector('.filters__label');

    input.name = type;
    input.dataset.filterType = type;
    input.value = item.id;
    label.textContent = item.name || item.nameEn;

    input.addEventListener('change', applyFilters);
    listEl.appendChild(clone);
  });
}

function applyFilters() {
  const checkedInputs = document.querySelectorAll('.filters__input:checked');

  if (checkedInputs.length === 0) {
    renderCards(allDestinations);
    return;
  }

  const selected = {
    destination: [],
    country: [],
    holiday: []
  };

  checkedInputs.forEach(input => {
    const type = input.dataset.filterType || input.name;
    if (selected[type]) {
      selected[type].push(input.value);
    }
  });

  const filtered = allDestinations.filter(item => {
    const matchDest = (selected.destination.length === 0 && selected.country.length === 0) || 
                      selected.destination.includes(item.countryId) || 
                      selected.country.includes(item.countryId);
                      
    const matchType = selected.holiday.length === 0 || selected.holiday.includes(item.categoryId);

    return matchDest && matchType;
  });

  renderCards(filtered);
}

function renderCards(items) {
  if (!cardsContainer) return;

  if (items.length === 0) {
    cardsContainer.innerHTML = `<p style="padding: 20px;">Nessun pacchetto trovato.</p>`;
    return;
  }

  cardsContainer.innerHTML = items.map(item => {
    const country = allCountries.find(c => c.id === item.countryId);
    const countryName = country ? (country.name || country.nameEn || '') : '';
    const locationText = countryName && item.city ? `${countryName}, ${item.city}` : (item.city || countryName || '');

    return `
      <li class="pacchetti__item search-card">
        <img
          src="${item.image || ''}"
          class="pacchetti__img search-card__img"
          alt="${item.name || 'Surf card'}"
        />
        <span class="search-card__badge">${item.categoryId || 'Surf Camp'}</span>
        <h2 class="pacchetti__title search-card__location">
          ${locationText}
        </h2>
        <p class="pacchetti__item__desc search-card__title">
          ${item.shortDescription || ''}
        </p>
      </li>
    `;
  }).join('');
}

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
  });
}

init();