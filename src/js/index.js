import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, clearLoader, renderLoader } from './views/base';

/** Global state of the App
* - Search Results
* - Current Recipes
* - Shopping List
* - Liked Recipes
*/
const state = {};

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);

        // Prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        // Get data from API
        await state.search.getResults();
        // Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
