

const styles = {
    container: {
        flexGrow: 1,
        minWidth: 200,
        maxWidth: 350,
        height: 400,
        backgroundColor: "#fad7e2",
        overflowY: "hidden",
        overflowX: "hidden",
        margin: "0 8px 16px 8px"
    },
    imageContainer: {
        display: "flex",
        height: 150,
        alignItems: "center",
        overflowY: "hidden",

    },
    image: {
        width: "100%"
    },
    drinkTitle: {
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "inherit"
    }
}

export default function Card(props) {
    const {drink} = props;

    return (
    <div style={styles.container}>
        <div style={styles.imageContainer}>
            <img style={styles.image} src={drink.strDrinkThumb + "/preview"} alt="preview"/>
        </div>
        <p style={styles.drinkTitle}>{drink.strDrink}</p>
    </div>
    );
}