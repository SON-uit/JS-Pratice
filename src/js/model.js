import { API_URL, KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: 10,
  },
  bookmarks: [],
};
export const loadRecipe = async id => {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const recipe = { ...data.data.recipe };
    state.recipe = recipe;
    if (state.bookmarks.some(b => b.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    throw new Error('We could not find this recipe');
  }
};
export const loadSearchResults = async query => {
  try {
    const data = await getJSON(`${API_URL}/?search=${query}`);
    state.search.page = 1;
    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return { ...rec };
    });
  } catch (err) {
    console.error(err);
    throw new Error('We could not find this recipe');
  }
};
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(el => {
    el.quantity = (el.quantity / state.recipe.servings) * newServing;
  });
  state.recipe.servings = newServing;
};
const persitBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persitBookmarks();
};
export const deleteBookMark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persitBookmarks();
};
const init = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};
init();
const clearBookmark = function () {
  localStorage.clear('bookmarks');
};
export const uploadRecipe = async function (newRecipe) {
  try {
  const data = Object.entries(newRecipe);
  const ingredients = data
    .filter(ingre => ingre[0].startsWith('ingredient') && ingre[1] !== '')
    .map(el => {
      const ingreArr = el[1].replaceAll(' ', '').split(',');
      if (ingreArr.length !== 3) throw new Error('Wrong format to upload new recipe.Please check againt');
      const [quantity, unit, description] = ingreArr;
      return { quantity: quantity? +quantity : null, unit, description };
    })
  const recipe =  {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    ingredients,
    servings: +newRecipe.servings,
    cooking_time: +newRecipe.cookingTime,
    publisher: newRecipe.publisher
  }
  const res = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
  const uploadedRecipe = {...res.data.recipe}
  state.recipe = uploadedRecipe;
  addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
