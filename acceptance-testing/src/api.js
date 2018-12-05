import axios from 'axios';
import data from './data';

export const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';
export const APP_ID = '1b9a4cf6f5eecebb884e5b6e7144cb98';

export const fetchUsingApi = city => {
  const url = `${BASE_URL}?q=${city},uk&units=metric&appid=${APP_ID}`;
  
  return axios.get(url);
};

export const fetchUsingMock = city => {
  return Promise.resolve({ data: data[city.toLowerCase()] });
};
