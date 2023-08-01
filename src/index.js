import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/pixabayAPI';
import { createMarkup } from './js/createCards';

const formSearchRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
//console.log(formSearchRef);
//console.log(galleryRef);

// Notify.init({
//   position: 'center-center',
// });
let currentPage = 1;
let searchQuery = '';

fetchImages()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });

formSearchRef.addEventListener('submit', onSubmitSearch);

function onSubmitSearch(event) {
  event.preventDefault();
  //console.dir(event.target);
  //console.log(event.target.elements.searchQuery.value);
  //const { searchQuery } = event.target.elements;
  // console.log(searchQuery.value);
  searchQuery = event.target.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return Notify.failure('Enter a search string');
  }
  fetchImages(searchQuery, currentPage)
    .then(data => {
      console.log(data.hits);
      renderGallery(data.hits);
      //list.insertAdjacentHTML('beforeend', createMarkup(data.results));
      //observer.observe(target); // +
      // Если текущая страница и общее количество страниц не совпадве отоброжаем кнопку
      //if (data.page !== data.total_pages) {
      //  loadMore.hidden = false;
      //}
    })
    .catch(err => console.log(err));
}

loadMoreRef.addEventListener('click', onLoad);

function onLoad() {
  currentPage += 1;
  fetchImages(searchQuery, currentPage)
    .then(data => {
      renderGallery(data.hits);
      // Если текущая страница и общее количество страниц совпало, скрываем кнопку
      //   if (data.page === data.total_pages) {
      //     loadMore.hidden = true;
      //   }
    })
    .catch(err => console.log(err));
}

function renderGallery(dataArr) {
  galleryRef.insertAdjacentHTML('beforeend', createMarkup(dataArr));
}
