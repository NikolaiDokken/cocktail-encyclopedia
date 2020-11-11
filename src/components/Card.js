

const styles = {
    container: {
        width: 200,
        height: 400,
        borderRadius: 8,
        backgroundColor: "#fad7e2",
        overflowY: "hidden",
        overflowX: "hidden",
        marginBottom: 16
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
        color: "black",
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "bold"
    }
}


export default function Card(props) {
    const {drink} = props;

    return (
    <div style={styles.container}>
        <div style={styles.imageContainer}>
            <img style={styles.image} src={drink.strDrinkThumb + "/preview"} alt="preview"/>
        </div>
        <div style={styles.drinkTitle}>{drink.strDrink}</div>
        
    </div>
    );
}