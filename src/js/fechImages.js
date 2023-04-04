import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34901760-7d58d5b4fa3fae593317e5336';

  async feschImages() {
    try {
      return await axios
        .get(this.#BASE_URL, {
          params: {
            key: this.#API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.page,
            per_page: this.per_page,
          },
        })
        .then(data => {
          this.incrementPage();

          return data.data;
        });
    } catch (error) {
      Notify.warning(`${error.message}`);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
