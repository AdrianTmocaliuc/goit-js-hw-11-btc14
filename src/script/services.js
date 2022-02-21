// export { onLoadMore, renderGallery };
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import picsTpl from '../handleBars/pics.hbs';
import PicsApiPixabay from '../handleBars/pics.hbs';
const picsApiPixabay = new PicsApiPixabay();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'href',
  captionDelay: 250,
});

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

function renderGallery(res) {
  const arrayOfCards = res.hits;
  refs.gallery.insertAdjacentHTML('beforeend', picsTpl(arrayOfCards));
}
