const axios = require("axios").default;
const url = "https://www.thecocktaildb.com/api/json/v1/1";

class CocktailService {
    getCocktailByName(searchQuery, signal) {
        return axios.get(url + "/search.php?s=" + searchQuery, { signal });
    }

    getCocktailByIngredient(searchQuery, signal) {
        return axios.get(url + "/filter.php?i=" + searchQuery, { signal });
    }

    getRandomCocktail() {
        return axios.get(url + "/random.php");
    }

    getCocktailById(id) {
        return axios.get(url + "/lookup.php?i=" + id);
    }
}

const cocktailService = new CocktailService();
export default cocktailService;
