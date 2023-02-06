const BASE_URL = 'https://restcountries.com/v3.1/name';

const filter = 'fields=name,capital,populatio,flags,languages';

export const fetchCountryAPI = cityName => {
  return fetch(`${BASE_URL}${cityName}?${filter}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
