import { NewsApiService } from './js/fechImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  formEl: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', handleSearch);
refs.loadMoreBtn.addEventListener('click', handleLoadMore);

refs.loadMoreBtn.style.display = 'none';

const newsApiService = new NewsApiService();

// console.log(newsApiService);

function handleSearch(e) {
  e.preventDefault();

    if (e.currentTarget.elements.searchQuery.value.trim() === '') {
       clearGalleryMarkup();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
    e.currentTarget.elements.searchQuery.value = '';
    
    // refs.loadMoreBtn.disabled = true;
  newsApiService.resetPage();
  newsApiService.feschImages().then(hits => {
      if (hits.hits.length === 0) {
          
      clearGalleryMarkup();
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      } else {
          clearGalleryMarkup();
        appendGaleryMarkup(hits);
        Notify.success(
        `Hooray! We found ${hits.totalHits} images.`
          );
          Notify.info(
        `${hits.totalHits - (newsApiService.page - 1) * newsApiService.per_page} images left.`
      );
        console.log(hits);
        refs.loadMoreBtn.style.display = 'block';
        // refs.loadMoreBtn.disabled = false;
    }
  });
}

function handleLoadMore() {
    refs.loadMoreBtn.style.display = 'none';
    newsApiService.feschImages().then(hits => {
    //    hits.totalHits -= (newsApiService.per_page += 40);
        appendGaleryMarkup(hits);
        Notify.info(
        `${hits.totalHits - (newsApiService.page - 1) * newsApiService.per_page} images left.`
      );
    //     Notify.success(
    //     `Hooray! We found ${hits.totalHits - newsApiService.page * newsApiService.per_page} images.`
    //   );
        refs.loadMoreBtn.style.display = 'block';
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
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=350 />
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
