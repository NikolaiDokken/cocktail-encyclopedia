import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useCallback } from "react";
import CocktailService from "./services/CocktailService";
import Card from "./components/Card";

const searchTypeEnum = { drink: 1, ingredient: 2 };

export default function App() {
    const [drinks, setDrinks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState(searchTypeEnum.drink);

    const handleSearch = useCallback(
        (event) => {
            if (searchQuery.length > 0 && event.keyCode === 13) {
                if (document.getElementById("drinkSearchType").checked) {
                    CocktailService.getCocktailByName(searchQuery).then(
                        (response) => {
                            if (response.data.drinks) {
                                setDrinks(response.data.drinks);
                            } else {
                                setDrinks([]);
                            }
                        }
                    );
                }
                if (document.getElementById("ingredientSearchType").checked) {
                    CocktailService.getCocktailByIngredient(searchQuery).then(
                        (response) => {
                            if (response.data.drinks) {
                                setDrinks(response.data.drinks);
                            } else {
                                setDrinks([]);
                            }
                        }
                    );
                }
            }
        },
        [searchQuery]
    );

    useEffect(() => {
        CocktailService.getRandomCocktail().then((response) => {
            setDrinks(response.data.drinks);
        });
    }, []);

    useEffect(() => {
        document
            .getElementById("searchbar")
            .addEventListener("keydown", handleSearch, false);
        return () => {
            document
                .getElementById("searchbar")
                .removeEventListener("keydown", handleSearch, false);
        };
    }, [handleSearch]);

    const searchTypeToggle = (event) => {
        if (event.target.value === "ingredient") {
            setSearchType(searchTypeEnum.ingredient);
        } else if (event.target.value) {
            setSearchType(searchTypeEnum.drink);
        }
    };

    return (
        <div style={styles.app}>
            <div style={styles.header}>
                <img
                    src={logo}
                    style={styles.appLogo}
                    className="App-logo"
                    alt="logo"
                />
                The Cocktail Encyclopedia
            </div>
            <div style={styles.searcTypeSelector} onChange={searchTypeToggle}>
                <div style={{ marginRight: 8, fontSize: 16 }}>Search for:</div>
                <input
                    type="radio"
                    id="drinkSearchType"
                    name="searchType"
                    value="drink"
                    defaultChecked
                />{" "}
                Drink
                <input
                    type="radio"
                    id="ingredientSearchType"
                    name="searchType"
                    value="ingredient"
                    style={{ marginLeft: 8 }}
                />{" "}
                Ingredient
            </div>
            <input
                id={"searchbar"}
                style={styles.searchBar}
                value={searchQuery}
                placeholder={
                    searchType === searchTypeEnum.drink
                        ? "Tequila Sunrise"
                        : "Grenadine"
                }
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length === 0 ? <div>Have you tried...</div> : ""}
            <div style={styles.cardContainer}>
                {drinks.map((drink, index) => (
                    <Card drink={drink} key={index} />
                ))}
            </div>
            {drinks.length === 0 ? <div>No search results</div> : ""}
        </div>
    );
}

const styles = {
    app: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "calc(10px + 2vmin)",
        color: "white",
        justifyContent: "center",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
    },
    appLogo: {
        height: "9vmin",
        pointerEvents: "none",
        marginRight: 16,
    },
    searcTypeSelector: {
        fontSize: 14,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    searchBar: {
        borderRadius: 8,
        border: "1px solid white",
        // borderBottom: "4px solid white",
        height: 32,
        width: 300,
        backgroundColor: "inherit",
        marginTop: 16,
        fontSize: 20,
        color: "white",
        outline: "none",
        marginBottom: 16,
    },
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        padding: "0 16px 0 16px",
    },
};
