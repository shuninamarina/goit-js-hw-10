import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import '../css/styles.css';
import { fetchCountryAPI } from './countriesAPI.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const onSearchCountryInput = event => {
  const searchedQuery = event.target.value.trim();
  if (!searchedQuery) {
    Notify.warning('Введіть назву країни');
    clearCountryInfo();
    clearCountryList();
    return;
  }
  fetchCountryAPI(searchedQuery)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        clearCountryInfo();
        clearCountryList();
        return;
      }

      if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      }

      if (data.length === 1) {
        clearCountryList();
        renderCountryCard(data);
        return;
      }
    })
    .catch(err => {
      if (err.message === '404') {
        Notify.failure('Oops, there is no country with that name');
        clearCountryInfo();
        clearCountryList();
      }
      console.log(err);
    });
};

refs.searchCountry.addEventListener(
  'input',
  debounce(onSearchCountryInput, DEBOUNCE_DELAY)
);

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

// country list

function renderCountryList(data) {
  const markup = data.map(({ name: { official }, flags: { svg, alt } }) => {
    return `
    <li class="country-item"><img width="25px" src="${svg}" alt="${alt}" /><span>${official}</span></li>
    `;
  });
  refs.countryList.innerHTML = markup;
}

// country card
function renderCountryCard(data) {
  const markup = data
    .map(
      ({
        name: { official },
        flags: { svg, alt },
        capital,
        population,
        languages,
      }) => {
        return `
    <div>
  <img width="25px" src="${svg}" alt="${alt}" />
  <h2>${official}</h2>
</div>
<p><b>Capital: </b><span>${capital}</span> </p> 
<p><b>Poulation: </b><span>${population} </span> </p> 
<p><b>Languages: </b> <span> ${Object.values(languages).join(', ')}</span></p>
`;
      }
    )
    .join('');
  refs.countryInfo.innerHTML = markup;
}
