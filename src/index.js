import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/pixabayAPI';
import { createMarkup } from './js/createCards';
import { smoothScroll } from './js/setScroll';

const formSearchRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');
// + for infiniti scroll
const target = document.querySelector('.js-guard');

const PER_PAGE = 40;
let currentPage = 1;
let totalHits = 0;
let searchQuery = '';
const simpleLightBoxLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// let options = {
//   root: null,
//   rootMargin: '300px',
//   threshold: 1.0,
// };
// let observer = new IntersectionObserver(onLoadInfinitiScroll, options);

// loadMoreRef.hidden = true; - Не работает. Сделано через class=is-hidden

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
      //observer.observe(target); // + for infiniti scroll

      if (data.hits.length === data.totalHits) {
        // 'zaz'
        loadMoreRef.classList.add('is-hidden');
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (data.hits.length < data.totalHits) {
        loadMoreRef.classList.remove('is-hidden'); //- for Btn  loadMore
      }
    })
    .catch(err => console.log(err));
}

loadMoreRef.addEventListener('click', onLoad); //

function onLoad() {
  currentPage += 1;
  fetchImages(searchQuery, currentPage, PER_PAGE)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBoxLightbox.refresh();

      if (currentPage === Math.ceil(data.totalHits / PER_PAGE)) {
        loadMoreRef.classList.add('is-hidden');
        Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        //observer.unobserve(target); // +
      } else {
        loadMoreRef.classList.remove('is-hidden'); // -
      }
      smoothScroll(galleryRef);
    })
    .catch(err => console.log(err));
}

// function onLoadInfinitiScroll(entries, observer) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       currentPage += 1;
//       fetchImages(searchQuery, currentPage, PER_PAGE)
//         .then(data => {
//           renderGallery(data.hits);
//           simpleLightBoxLightbox.refresh();
//
//           if (currentPage === Math.ceil(data.totalHits / PER_PAGE)) {
//             loadMoreRef.classList.add('is-hidden');
//             Notify.warning(
//               "We're sorry, but you've reached the end of search results."
//             );
//             observer.unobserve(target); // +
//           } else {
//             //loadMoreRef.classList.remove('is-hidden'); // -
//           }
//           smoothScroll(galleryRef);
//         })
//         .catch(err => console.log(err));
//     }
//   });
// }

function renderGallery(dataArr) {
  galleryRef.insertAdjacentHTML('beforeend', createMarkup(dataArr));
}

function resetQuery() {
  galleryRef.innerHTML = '';
  currentPage = 1;
}
