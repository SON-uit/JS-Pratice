import icon from '../../img/icons.svg';
export default class View {
  _data;
  /**
   * Render recieved object into DOM
   * @param {Object || Object[]} data // The data to be render 
   * @returns {undefined};
   * @this {Object} View object;
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup); // nhan vao string tra ve DOM object
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((el, index) => {
      const curEl = curElements[index];
      if (!el.isEqualNode(curEl) && el.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = el.textContent;
      }
      if (!el.isEqualNode(curEl)) {
        Array.from(el.attributes).forEach(elements =>
          curEl.setAttribute(elements.name, elements.value)
        );
      }
    });
  }
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icon}#icon-loader"></use>
        </svg>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const error = `<div class="error">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', error);
  }
  renderMessage(message = this._errorMessage) {
    const error = `<div class="error">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', error);
  }
}
