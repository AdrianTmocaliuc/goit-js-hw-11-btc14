import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class PicApiPixabay {
  API_KEY = '23808150-51820317ad7670f55f1a98c8b';
  PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';
  PER_PAGE = 40;
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getPics() {
    const response = await axios(
      `?key=${this.API_KEY}&q=${this.searchQuery}&${this.PARAMS}&per_page=${this.PER_PAGE}&page=${this.page}`,
    );
    this.incrimentPage();
    return response.data;
  }

  incrimentPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearch) {
    this.searchQuery = newSearch;
  }
}
