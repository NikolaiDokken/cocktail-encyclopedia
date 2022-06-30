import React, { useState, useEffect } from "react";
// import { makeStyles } from "@mui/styles";
import CocktailService from "../services/CocktailService";
import { Card, CardActions, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";

export default function CocktailCard({ drinkId }) {
    const [showInstructions, setShowInstructions] = useState(false);
    const [drink, setDrink] = useState({});
    useEffect(() => {
        setDrink(
            CocktailService.getCocktailById(drinkId).then((response) => {
                setDrink(response.data.drinks[0]);
            })
        );
    }, [drinkId]);

    const getIngredients = (drink) => {
        var ingredients = [];
        if (drink.strIngredient1)
            ingredients.push({
                measure: drink.strMeasure1,
                ingredient: drink.strIngredient1,
            });
        if (drink.strIngredient2)
            ingredients.push({
                measure: drink.strMeasure2,
                ingredient: drink.strIngredient2,
            });
        if (drink.strIngredient3)
            ingredients.push({
                measure: drink.strMeasure3,
                ingredient: drink.strIngredient3,
            });
        if (drink.strIngredient4)
            ingredients.push({
                measure: drink.strMeasure4,
                ingredient: drink.strIngredient4,
            });
        if (drink.strIngredient5)
            ingredients.push({
                measure: drink.strMeasure5,
                ingredient: drink.strIngredient5,
            });
        if (drink.strIngredient6)
            ingredients.push({
                measure: drink.strMeasure6,
                ingredient: drink.strIngredient6,
            });
        if (drink.strIngredient7)
            ingredients.push({
                measure: drink.strMeasure7,
                ingredient: drink.strIngredient7,
            });
        if (drink.strIngredient8)
            ingredients.push({
                measure: drink.strMeasure8,
                ingredient: drink.strIngredient8,
            });
        if (drink.strIngredient9)
            ingredients.push({
                measure: drink.strMeasure9,
                ingredient: drink.strIngredient9,
            });
        if (drink.strIngredient10)
            ingredients.push({
                measure: drink.strMeasure10,
                ingredient: drink.strIngredient10,
            });
        if (drink.strIngredient11)
            ingredients.push({
                measure: drink.strMeasure11,
                ingredient: drink.strIngredient11,
            });
        if (drink.strIngredient12)
            ingredients.push({
                measure: drink.strMeasure12,
                ingredient: drink.strIngredient12,
            });
        if (drink.strIngredient13)
            ingredients.push({
                measure: drink.strMeasure13,
                ingredient: drink.strIngredient13,
            });
        if (drink.strIngredient14)
            ingredients.push({
                measure: drink.strMeasure14,
                ingredient: drink.strIngredient14,
            });
        if (drink.strIngredient15)
            ingredients.push({
                measure: drink.strMeasure15,
                ingredient: drink.strIngredient15,
            });
        return ingredients;
    };
    return (
        <Card>
            <CardMedia
                sx={{ height: "180px" }}
                image={drink.strDrinkThumb}
                component="img"
                title={drink.strDrink + " preview"}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {drink.strDrink}
                </Typography>
                <Box sx={{ height: "80px", overflowY: "auto" }}>
                    {showInstructions ? (
                        <Typography variant="body2" color="text" component="p">
                            {drink.strInstructions}
                        </Typography>
                    ) : (
                        <ul style={{ margin: 0, padding: 4 }}>
                            {getIngredients(drink).map((ingredient, index) => (
                                <Typography variant="body2" color="text" key={index}>
                                    {"- " +
                                        (ingredient.measure
                                            ? ingredient.measure + " " + ingredient.ingredient
                                            : ingredient.ingredient)}
                                </Typography>
                            ))}
                        </ul>
                    )}
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => setShowInstructions(!showInstructions)}>
                    {showInstructions ? "Ingredients" : "Instructions"}
                </Button>
            </CardActions>
        </Card>
    );
}
