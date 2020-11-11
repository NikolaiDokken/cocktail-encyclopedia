import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import CocktailService from "./services/CocktailService";
import Card from "./components/Card";

export default function App() {
    const [drinks, setDrinks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery.length > 2) {
            CocktailService.getCocktailByName(searchQuery).then(response => {
                if (response.data.drinks) {
                    setDrinks(response.data.drinks);
                }
            })
        } else {
            setDrinks([]);
        }
    }, [searchQuery]);

  return (
    <div style={styles.app}>
        <div style={styles.header}>
            <img src={logo} style={styles.appLogo} className="App-logo" alt="logo" />
            The Cocktail Encyclopedia
        </div>
        <input style={styles.searchBar} value={searchQuery} placeholder="Search for drink or ingredient" onChange={(e) => setSearchQuery(e.target.value)} />
        <div style={styles.cardContainer}>
            {drinks.map((drink, index) => 
            <Card drink={drink} key={index} /> 
            )}
        </div>
    </div>
  );
}

const styles = {
    app: {
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "calc(10px + 2vmin)",
        color: "white",
        justifyContent: "center"
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 8
    },
    appLogo: {
        height: "9vmin",
        pointerEvents: "none",
        marginRight: 16
    },
    searchBar: {
        border: "none",
        borderBottom: "4px solid white",
        height: 32,
        width: 300,
        backgroundColor: "#040d20",
        marginTop: 16,
        fontSize: 20,
        color: "white",
        outline: "none",
        marginBottom: 16
    },
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        padding: "0 16px 0 16px"
    }
}
