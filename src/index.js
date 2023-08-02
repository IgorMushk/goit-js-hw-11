import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/pixabayAPI';
import { createMarkup } from './js/createCards';
import { smoothScroll } from './js/setScroll';

const formSearchRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');

const PER_PAGE = 40;
let currentPage = 1;
let totalHits = 0;
let searchQuery = '';
const simpleLightBoxLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

fetchImages()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });

// loadMoreRef.hidden = true; - Не работает. Нужно через class

formSearchRef.addEventListener('submit', onSubmitSearch);

function onSubmitSearch(event) {
  event.preventDefault();

  resetQuery();

  searchQuery = event.target.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return Notify.failure('Enter a search string');
  }

  fetchImages(searchQuery, currentPage, PER_PAGE)
    .then(data => {
      console.log(data);

      //-// console.log('-1-', data.hits.length, data.totalHits);

      if (!data.hits.length & !data.totalHits) {
        loadMoreRef.classList.add('is-hidden');
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      totalHits = data.totalHits;
      if (currentPage === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      renderGallery(data.hits);
      simpleLightBoxLightbox.refresh();

      if (data.hits.length === data.totalHits) {
        // 'zaz'
        //-// console.log('-2-', data.hits.length, data.totalHits);
        loadMoreRef.classList.add('is-hidden');
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (data.hits.length < data.totalHits) {
        loadMoreRef.classList.remove('is-hidden');
      }
    })
    .catch(err => console.log(err));
}

loadMoreRef.addEventListener('click', onLoad);

function onLoad() {
  currentPage += 1;
  fetchImages(searchQuery, currentPage, PER_PAGE)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBoxLightbox.refresh();

      //-// console.log('-3-', currentPage, data.hits.length, data.totalHits);
      if (currentPage === Math.ceil(data.totalHits / PER_PAGE)) {
        loadMoreRef.classList.add('is-hidden');
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMoreRef.classList.remove('is-hidden');
      }
      smoothScroll(galleryRef);
    })
    .catch(err => console.log(err));
}

function renderGallery(dataArr) {
  galleryRef.insertAdjacentHTML('beforeend', createMarkup(dataArr));
}

function resetQuery() {
  galleryRef.innerHTML = '';
  currentPage = 1;
}
