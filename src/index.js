import './sass/main.scss';
import { BtnService } from './script/loadMoreBtn';

import { refs } from './script/refs';
import { onLoadMore, notifications } from './script/services';
import PicsApiPixabay from './script/searchApi';

const picsApiPixabay = new PicsApiPixabay();
const loadMoreBtn = new BtnService({
  selector: '.load-more',
  hidden: true,
});

refs.form.addEventListener('submit', submitBtn);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function submitBtn(e) {
  e.preventDefault();
  picsApiPixabay.resetPage();
  refs.gallery.innerHTML = '';

  notifications();
}
