import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import CocktailService from "../services/CocktailService";

const styles = {
    containerFront: {
        minWidth: 250,
        maxWidth: 350,
        backgroundColor: "#4ba8d6",
        margin: "0 8px 16px 8px",
        borderRadius: 8,
    },
    containerBack: {
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 350,
        backgroundColor: "#4ba8d6",
        margin: "0 8px 16px 8px",
        borderRadius: 8,
        height: 225,
    },
    image: {
        objectFit: "cover",
        width: "100%",
        height: 200,
        borderRadius: "8px 8px 0 0",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 8,
    },
    drinkTitle: {
        display: "flex",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    descriptionContainer: {
        display: "flex",
        flexDirection: "row",
        fontSize: 16,
        justifyContent: "space-between",
    },
    descriptionItem: {
        flex: 0.9,
    },
};

export default function Card(props) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [drink, setDrink] = useState({});

    const flip = () => {
        setIsFlipped(!isFlipped);
    };

    useEffect(() => {
        setDrink(
            CocktailService.getCocktailById(props.drink.idDrink).then(
                (response) => {
                    setDrink(response.data.drinks[0]);
                }
            )
        );
    }, [props.drink.idDrink]);

    const getIngredients = (drink) => {
        var ingredients = [];
        if (drink.strIngredient1)
            ingredients.push(drink.strMeasure1 + " " + drink.strIngredient1);
        if (drink.strIngredient2)
            ingredients.push(drink.strMeasure2 + " " + drink.strIngredient2);
        if (drink.strIngredient3)
            ingredients.push(drink.strMeasure3 + " " + drink.strIngredient3);
        if (drink.strIngredient4)
            ingredients.push(drink.strMeasure4 + " " + drink.strIngredient4);
        if (drink.strIngredient5)
            ingredients.push(drink.strMeasure5 + " " + drink.strIngredient5);
        if (drink.strIngredient6)
            ingredients.push(drink.strMeasure6 + " " + drink.strIngredient6);
        if (drink.strIngredient7)
            ingredients.push(drink.strMeasure7 + " " + drink.strIngredient7);
        if (drink.strIngredient8)
            ingredients.push(drink.strMeasure8 + " " + drink.strIngredient8);
        if (drink.strIngredient9)
            ingredients.push(drink.strMeasure9 + " " + drink.strIngredient9);
        if (drink.strIngredient10)
            ingredients.push(drink.strMeasure10 + " " + drink.strIngredient10);
        if (drink.strIngredient11)
            ingredients.push(drink.strMeasure11 + " " + drink.strIngredient11);
        if (drink.strIngredient12)
            ingredients.push(drink.strMeasure12 + " " + drink.strIngredient12);
        if (drink.strIngredient13)
            ingredients.push(drink.strMeasure13 + " " + drink.strIngredient13);
        if (drink.strIngredient14)
            ingredients.push(drink.strMeasure14 + " " + drink.strIngredient14);
        if (drink.strIngredient15)
            ingredients.push(drink.strMeasure15 + " " + drink.strIngredient15);
        return ingredients;
    };

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div onClick={flip} style={styles.containerFront}>
                <img
                    style={styles.image}
                    src={drink.strDrinkThumb}
                    alt={drink.strDrink + "Preview"}
                />
                <div style={styles.drinkTitle}>{drink.strDrink}</div>
            </div>
            <div onClick={flip} style={styles.containerBack}>
                <div style={styles.descriptionContainer}>
                    <div style={styles.descriptionItem}>
                        <ul style={{ margin: 0, paddingLeft: 24 }}>
                            {getIngredients(drink).map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div style={styles.descriptionItem}>
                        {drink.strInstructions}
                    </div>
                </div>
            </div>
        </ReactCardFlip>
    );
}
