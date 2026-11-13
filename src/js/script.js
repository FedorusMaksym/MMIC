import "./newletter"
import "./dest"
import "./sidebar"

import dbUrl from 'url:../db.json';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const cardsContainer = document.querySelector('.search-list');
const templateInput = document.querySelector('[data-filter-template]');
const searchForm = document.getElementById('search-form');

let allDestinations = [];
let allCountries = [];

async function init() {
  try {
    let destinations, categories, countries;

    if (isLocal) {
      const [destRes, categoriesRes, countriesRes] = await Promise.all([
        fetch('http://localhost:3001/destinations'),
        fetch('http://localhost:3001/categories'),
        fetch('http://localhost:3001/countries')
      ]);
      destinations = await destRes.json();
      categories = await categoriesRes.json();
      countries = await countriesRes.json();
    } else {
      const res = await fetch(dbUrl);
      const data = await res.json();
      destinations = data.destinations || [];
      categories = data.categories || [];
      countries = data.countries || [];
    }

    allDestinations = destinations;
    allCountries = countries;

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
  
  console.log('Завантажені дані:', allDestinations);
  console.log('Обрані чекбокси:', Array.from(checkedInputs).map(i => i.value));

  if (allDestinations.length === 0) {
    console.warn('Масив allDestinations порожній! Дані з db.json ще не підтягнулися.');
    return;
  }

  if (checkedInputs.length === 0) {
    renderCards(allDestinations);
    return;
  }

  const selectedValues = Array.from(checkedInputs).map(input => String(input.value));

  const filtered = allDestinations.filter(item => {
    const itemValue1 = String(item.countryId || item.country || '');
    const itemValue2 = String(item.categoryId || item.category || '');

    return selectedValues.includes(itemValue1) || selectedValues.includes(itemValue2);
  });

  console.log('Відфільтровані картки:', filtered);
  renderCards(filtered);
}

document.querySelectorAll('.filters__input').forEach(input => {
  input.addEventListener('change', applyFilters);
});

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