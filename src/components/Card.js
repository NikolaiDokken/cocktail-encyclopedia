

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
        var i = 1;
        while(eval("drink.strIngredient" + i) !== null && eval("drink.strIngredient" + i) !== "") {
            ingredients.push(eval("drink.strMeasure" + i) + " " + eval("drink.strIngredient" + i));
            i++;
        }
        return ingredients;
    }
    console.log(drink)
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