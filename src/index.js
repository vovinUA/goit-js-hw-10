import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

import { fetchCountries } from './fetchCountries';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const debounceFetchCountries = debounce(searchQuery => {
  searchQuery = searchQuery.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        clearMarkup();
      } else if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
        clearMarkup(refs.countryInfo);
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        clearMarkup(refs.countryList);
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearMarkup();
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        Notiflix.Notify.failure('Something went wrong');
      }
      clearMarkup();
    });
}, DEBOUNCE_DELAY);

refs.searchBox.addEventListener('input', e => {
  debounceFetchCountries(e.target.value);
});

function clearMarkup(element = refs.countryList) {
  element.innerHTML = '';
};

function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li class="country-item">
          <img class="country-flag" src="${country.flags.png}" alt="Flag of ${country.name.common}" width="40">
          <span class="country-title">${country.name.common}</span>
        </li>`
    )
    .join('');
  refs.countryList.innerHTML = markup;
};

function renderCountryInfo(country) {
  const markup = `<div class="country-card">
                    <img class="country-flag" src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
                    <div class="country-details">
                      <h2 class="country-name">${country.name.common}</h2>
                      <p><span class="label">Capital:</span> ${country.capital}</p>
                      <p><span class="label">Population:</span> ${country.population}</p>
                      <p><span class="label">Languages:</span> ${Object.values(country.languages).join(', ')}</p>
                    </div>
                  </div>`;
  refs.countryInfo.innerHTML = markup;
};