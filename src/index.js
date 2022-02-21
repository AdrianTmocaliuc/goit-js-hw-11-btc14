// import { join } from 'lodash';
import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PicsApiPixabay from './script/searchApi';
import picsTpl from './handleBars/pics.hbs';

const picsApiPixabay = new PicsApiPixabay();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'href',
  captionDelay: 250,
});

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', submitBtn);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function submitBtn(e) {
  e.preventDefault();
  picsApiPixabay.resetPage();
  refs.gallery.innerHTML = '';

  const { searchQuery } = refs.form.elements;
  picsApiPixabay.query = searchQuery.value.trim();

  try {
    const response = await picsApiPixabay.getPics();
    // console.log(response);
    const totalCards = response.totalHits;
    console.log(picsApiPixabay.PER_PAGE);

    if (totalCards > picsApiPixabay.PER_PAGE && picsApiPixabay.query !== '') {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
    if (picsApiPixabay.query === '') {
      Notify.info('Please enter text');
      return;
    }
    if (totalCards === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    Notify.success(`Hurray! Wi found about ${totalCards} images`);

    renderGallery(response);
    lightbox.refresh();
  } catch (err) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
}

function renderGallery(res) {
  const arrayOfCards = res.hits;
  refs.gallery.insertAdjacentHTML('beforeend', picsTpl(arrayOfCards));
}

async function onLoadMore() {
  const response = await picsApiPixabay.getPics();
  renderGallery(response);

  const totalPagesCount = response.total / picsApiPixabay.PER_PAGE;
  const currentPage = picsApiPixabay.page - 1;

  if (currentPage >= totalPagesCount) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
