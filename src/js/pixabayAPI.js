import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38570888-30e5be38999b280f1014d2377';
const PER_PAGE = 40;
const PAGE = 1;

export function fetchImages(query, page) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: `${query}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page: page,
  });
  //`${BASE_URL}?key=${API_KEY}&image_type=photo&q=cat&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}`
  return axios.get(`${BASE_URL}?${searchParams}`).then(response => {
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    return response.data;
  });
}

//https://pixabay.com/api/?key=38570888-30e5be38999b280f1014d2377&q=yellow+flowers&image_type=photo
// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.
// page и per_page
