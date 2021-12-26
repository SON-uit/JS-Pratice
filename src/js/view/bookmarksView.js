import View from '../view/View';
import icon from '../../img/icons.svg';
class BookMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No recipe for your query';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler())
  }
  _generateMarkup() {
    return this._data.map(temp => this._generateMarkupPreview(temp)).join('');
  }
  _generateMarkupPreview (data) {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview">
        <a class="preview__link ${data.id === id ?'preview__link--active': ''}" href="#${data.id}">
          <figure class="preview__fig">
            <img src="${data.image_url}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${data.title}</h4>
            <p class="preview__publisher">${data.publisher}</p>
            <div class="preview__user-generated ${data.key? '' :'hidden'}">
              <svg>
                <use href="${icon}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>`
  }
}
export default new BookMarkView();
