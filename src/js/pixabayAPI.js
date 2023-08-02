import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38570888-30e5be38999b280f1014d2377';
//const PER_PAGE = 40;
const PAGE = 1;

export function fetchImages(query, page, perPage) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: `${query}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    //per_page: PER_PAGE,
    per_page: perPage,
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
