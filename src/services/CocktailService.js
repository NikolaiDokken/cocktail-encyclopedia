const axios = require("axios").default;
const url = "https://www.thecocktaildb.com/api/json/v1/1";

class CocktailService {
    getCocktailByName(searchQuery) {
        return axios.get(url + "/search.php?s=" + searchQuery);
    }

    getCocktailByIngredient(searchQuery) {
        return axios.get(url + "/filter.php?i=" + searchQuery);
    }

    getRandomCocktail() {
        return axios.get(url + "/random.php");
    }

    getCocktailById(id) {
        return axios.get(url + "/lookup.php?i=" + id);
    }
}

export default new CocktailService();
