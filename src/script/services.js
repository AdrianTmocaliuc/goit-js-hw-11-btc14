import PicsApiPixabay from '../script/searchApi';
import { refs } from './refs';
import picsTpl from '../handleBars/pics.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { BtnService } from './loadMoreBtn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pictureApi = new PicsApiPixabay();
const loadMoreBtn = new BtnService({
  selector: '.load-more',
  hidden: true,
});

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'href',
  captionDelay: 250,
});

async function onLoadMore() {
  const response = await pictureApi.getPics();
  renderGallery(response);
  console.log(response);

  const totalPagesCount = response.total / pictureApi.PER_PAGE;
  const currentPage = pictureApi.page - 1;
  console.log(totalPagesCount);
  console.log(currentPage);

  if (currentPage >= totalPagesCount) {
    loadMoreBtn.hide();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function renderGallery(res) {
  const arrayOfCards = res.hits;
  refs.gallery.insertAdjacentHTML('beforeend', picsTpl(arrayOfCards));
}

async function notifications() {
  const { searchQuery } = refs.form.elements;
  pictureApi.query = searchQuery.value.trim();

  try {
    const response = await pictureApi.getPics();
    const totalCards = response.totalHits;

    if (totalCards > pictureApi.PER_PAGE && pictureApi.query !== '') {
      loadMoreBtn.show();
    }
    if (pictureApi.query === '') {
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

export { onLoadMore, renderGallery, notifications };
