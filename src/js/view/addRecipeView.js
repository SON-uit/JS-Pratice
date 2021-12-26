import View from '../view/View';
import icon from '../../img/icons.svg';
class AddRecipe extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was successfully upload';
  constructor() {
    super();
    this._addHandlerForm();
    this._removeHandlerForm();
  }
  toggleWindowShow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerForm() {
    this._btnOpen.addEventListener('click', this.toggleWindowShow.bind(this));
  };
  _removeHandlerForm() {
    this._btnClose.addEventListener('click', this.toggleWindowShow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindowShow.bind(this));
  };
  addHanderUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)]; // only can use with spread operator 
      const newRecipe = Object.fromEntries(data) // covert array to object;
      handler(newRecipe);
     // console.log(newRecipe);
    })
  }
}
export default new AddRecipe();
