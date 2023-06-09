import { NewsApiService } from './js/fechImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  scrollZoom: false,
});

refs.formEl.addEventListener('submit', handleSearch);
refs.loadMoreBtn.addEventListener('click', handleLoadMore);

refs.loadMoreBtn.style.display = 'none';

const newsApiService = new NewsApiService();

function handleSearch(e) {
  e.preventDefault();

  if (e.currentTarget.elements.searchQuery.value.trim() === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  e.currentTarget.elements.searchQuery.value = '';

  newsApiService.resetPage();
  newsApiService.feschImages().then(hits => {
    if (hits.length === 0) {
      clearGalleryMarkup();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (
      hits.totalHits <=
      (newsApiService.page - 1) * newsApiService.per_page
    ) {
      clearGalleryMarkup();
      appendGaleryMarkup(hits);
      simpleLightbox.refresh();
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.loadMoreBtn.style.display = 'none';
      return;
    } else {
      clearGalleryMarkup();
      appendGaleryMarkup(hits);
      simpleLightbox.refresh();
      Notify.success(`Hooray! We found ${hits.totalHits} images.`);
      Notify.info(
        `${
          hits.totalHits - (newsApiService.page - 1) * newsApiService.per_page
        } images left.`
      );

      refs.loadMoreBtn.style.display = 'block';
    }
  });
}

function handleLoadMore() {
  refs.loadMoreBtn.style.display = 'none';
  newsApiService.feschImages().then(hits => {
    if (hits.totalHits <= (newsApiService.page - 1) * newsApiService.per_page) {
      appendGaleryMarkup(hits);
      simpleLightbox.refresh();
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.loadMoreBtn.style.display = 'none';
      return;
    } else {
      appendGaleryMarkup(hits);
      simpleLightbox.refresh();
      Notify.info(
        `${
          hits.totalHits - (newsApiService.page - 1) * newsApiService.per_page
        } images left.`
      );
      refs.loadMoreBtn.style.display = 'block';
    }
  });
}

function appendGaleryMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
}

function createGalleryMarkup(hits) {
  return hits.hits
    .map(hit => {
      return `<div class="photo-card">
            <a href="${hit.largeImageURL}">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=350/>
            </a>
            <div class="info">
                <p class="info-item">
                <b>Likes:<br> ${hit.likes}</b>
                </p>
                <p class="info-item">
                <b>Views:<br> ${hit.views}</b>
                </p>
                <p class="info-item">
                <b>Comments:<br> ${hit.comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads:<br> ${hit.downloads}</b>
                </p>
            </div>
            </div>
        `;
    })
    .join('');
}

function clearGalleryMarkup() {
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.style.display = 'none';
}
