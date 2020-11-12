const axios = require("axios").default;
const url = "https://www.thecocktaildb.com/api/json/v1/1";

class CocktailService {
    getCocktailByName(searchQuery) {
        return axios.get(url + "/search.php?s=" + searchQuery)
    }
    
    getRandomCocktail() {
        return axios.get(url + "/random.php")
    }
}

export default new CocktailService();