import axios from 'axios';

export class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34901760-7d58d5b4fa3fae593317e5336';

  async feschImages() {
    console.log(this);
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
          console.log(data);
          this.incrementPage();

          return data.data;
        });
    } catch (error) {
      console.warn(error.message);
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
