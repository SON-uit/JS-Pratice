import * as model from  './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarkView  from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js'


// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const showRecipes = async () => {
  try {
    const id = window.location.hash.split('#')[1];
    if (!id) return ;
    recipeView.renderSpinner();
    // update result
    resultsView.update(model.getSearchResultPage())
    //1) loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //2) rendering recipe
    recipeView.render(recipe);
    //3) Update bookmark view
    bookmarkView.update(model.state.bookmarks);
    console.log(model.state.recipe)
  } catch (err) {
    recipeView.renderError(err);
  }
};
const controlSearchResult = async () => {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if(!query) return;
    //1) load
    await model.loadSearchResults(query);
    //2) rendering

    resultsView.render(model.getSearchResultPage());
    //3 rendering pagniatiton button
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
}
const controlPagination = async (page) => {
  try {
    //1) rendering result
    resultsView.render(model.getSearchResultPage(page));
    //2) rendering pagniatiton button
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
}
const controlServings = function (newServing) {
  //1 Update recipe serving (in state)
  model.updateServing(newServing);
  //2 redering new view
  recipeView.update(model.state.recipe);
}
const controlAddBookmark = function () {
  //1) add/remove bookmark
  if (model.state.recipe.bookmarked) { 
    model.deleteBookMark(model.state.recipe.id);
  } else {
    model.addBookMark(model.state.recipe);
  }
  //2) update view
  recipeView.update(model.state.recipe);
  //3) rendering bookmark
  bookmarkView.render(model.state.bookmarks);
}
const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
}
const controlAddRecipe = async function (newRecipe) {
  try {
  // show spinner
  recipeView.renderSpinner();
  await model.uploadRecipe(newRecipe);
  // Success message
  recipeView.renderMessage()
  
  // change ID URL
  window.history.pushState(null,'',`#${model.state.recipe.id}`);
  /* window.history.backState(null,'',`) */
  //close form 
  setTimeout(() =>
  addRecipeView.toggleWindowShow(),2500);
  //render recipe in recipe recipeView
  recipeView.render(model.state.recipe);
  // render bookmarkview 
  bookmarkView.render(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}
const init = async function () {
  bookmarkView.addHandlerRender(controlBookmark);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerRender(showRecipes);
  recipeView.addHandlerUpdateServing(controlServings)
  //3 ) addBookMark
  recipeView.addHanderBookmark(controlAddBookmark);
  searchView.addHanderSearch(controlSearchResult);
  //Add New Recipe
  addRecipeView.addHanderUpload(controlAddRecipe);
}
init();
/* window.addEventListener('hashchange', showRecipes);
window.addEventListener('load', showRecipes);
 */