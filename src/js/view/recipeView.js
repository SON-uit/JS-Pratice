import icon from '../../img/icons.svg';
import { Fraction } from 'fractional';
import View from '../view/View';
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could fint this recipe';
  _message = '';
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  addHandlerUpdateServing(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return ;
      const newServings = parseInt(btn.dataset.updateto)
      handler(newServings);
    })

  }
  addHanderBookmark (handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.bookmark');
      if (!btn) return ;
      handler();
    })
  }
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image_url}"alt="Tomato" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>
  
    <div class="recipe__details">
      <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icon}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cooking_time
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icon}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>
  
      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--increase-servings" data-updateto ="${this._data.servings - 1}">
          <svg>
            <use href="${icon}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings" data-updateto ="${this._data.servings + 1}">
          <svg>
            <use href="${icon}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
  
    <div class="recipe__user-generated ${this._data.key? '':'hidden'}">
      <svg>
        <use href="${icon}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round">
      <svg class="bookmark">
        <use href="${icon}#icon-bookmark${this._data.bookmarked === true ? '-fill' : ''}"></use>
      </svg>
    </button>
  </div>
  
  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
      ${this._data.ingredients
        .map(el => {
          return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icon}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            el.quantity ? new Fraction(el.quantity).toString() : ''
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${el.unit}</span>
            ${el.description}
          </div>
        </li>
        `;
        })
        .join('')}
    </ul>
  </div>
  
  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.source_url}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icon}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>
    `;
  }
}
export default new RecipeView();
