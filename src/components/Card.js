const styles = {
    container: {
        flexGrow: 1,
        minWidth: 250,
        maxWidth: 350,
        backgroundColor: "#373863",
        margin: "0 8px 16px 8px"
    },
    image: {
        objectFit: "cover",
        width: "100%",
        height: 200
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 8
    },
    drinkTitle: {
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "bold",
        margin: "0 0 16px 0",
        alignSelf: "center"
    },
    descriptionContainer: {
        display: "flex",
        flexDirection: "row",
    },
    descriptionItem: {
        width: "50%",
        fontSize: 16
    },
}

export default function Card(props) {
    const {drink} = props;

    const getIngredients = (drink) => {
        var ingredients = [];
        if (drink.strIngredient1) ingredients.push(drink.strMeasure1 + " "+ drink.strIngredient1);
        if (drink.strIngredient2) ingredients.push(drink.strMeasure2 + " " +drink.strIngredient2);
        if (drink.strIngredient3) ingredients.push(drink.strMeasure3 + " " +drink.strIngredient3);
        if (drink.strIngredient4) ingredients.push(drink.strMeasure4 + " " +drink.strIngredient4);
        if (drink.strIngredient5) ingredients.push(drink.strMeasure5 + " " +drink.strIngredient5);
        if (drink.strIngredient6) ingredients.push(drink.strMeasure6 + " " +drink.strIngredient6);
        if (drink.strIngredient7) ingredients.push(drink.strMeasure7 + " " +drink.strIngredient7);
        if (drink.strIngredient8) ingredients.push(drink.strMeasure8 + " " +drink.strIngredient8);
        if (drink.strIngredient9) ingredients.push(drink.strMeasure9 + " " +drink.strIngredient9);
        if (drink.strIngredient10) ingredients.push(drink.strMeasure10 + " " +drink.strIngredient10);
        if (drink.strIngredient11) ingredients.push(drink.strMeasure11 + " " +drink.strIngredient11);
        if (drink.strIngredient12) ingredients.push(drink.strMeasure12 + " " +drink.strIngredient12);
        if (drink.strIngredient13) ingredients.push(drink.strMeasure13 + " " +drink.strIngredient13);
        if (drink.strIngredient14) ingredients.push(drink.strMeasure14 + " " +drink.strIngredient14);
        if (drink.strIngredient15) ingredients.push(drink.strMeasure15 + " " +drink.strIngredient15);
        return ingredients;
    }
    getIngredients(drink);
    return (
    <div style={styles.container}>
        <img style={styles.image} src={drink.strDrinkThumb} alt="preview"/>
        <div style={styles.cardContent}>
            <p style={styles.drinkTitle}>{drink.strDrink}</p>
            <div style={styles.descriptionContainer}>
                <div style={styles.descriptionItem}>
                    <ul style={{margin: 0, paddingLeft: 24}}>
                    {getIngredients(drink).map((ingredient, index) => 
                        <li key={index}>{ingredient}</li>
                    )}
                    </ul>
                </div>
                <div style={styles.descriptionItem}>{drink.strInstructions}</div>
            </div>
        </div>
    </div>
    );
}