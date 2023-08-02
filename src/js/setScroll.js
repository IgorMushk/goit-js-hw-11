export function smoothScroll(galleryRef) {
  const { height: cardHeight } =
    document.galleryRef.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
