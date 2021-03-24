import "../App.css";
import { useEffect, useState } from "react";
import CocktailService from "../services/CocktailService";
import CocktailCard from "../components/CocktailCard";
import {
	TextField,
	Typography,
	InputAdornment,
	IconButton,
	Grid,
	Container,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

export default function Home() {
	const [drinks, setDrinks] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = () => {
		if (searchQuery.length > 0) {
			const cocktailsByName = CocktailService.getCocktailByName(
				searchQuery
			);
			const cocktailsByIngredient = CocktailService.getCocktailByIngredient(
				searchQuery
			);

			Promise.all([cocktailsByName, cocktailsByIngredient]).then(
				(results) => {
					var drinksName = results[0].data.drinks || [];
					const drinksIngredient = results[1].data.drinks || [];
					if (drinksName.length > 0 || drinksIngredient.length > 0) {
						drinksIngredient.forEach((drinkIng) => {
							if (
								!drinksName.find(
									(drinkName) =>
										drinkName.idDrink === drinkIng.idDrink
								)
							) {
								drinksName.push(drinkIng);
							}
						});
						setDrinks(drinksName);
					} else {
						setDrinks([]);
					}
					setHasSearched(true);
				}
			);

			/*
			CocktailService.getCocktailByName(searchQuery).then((response) => {
				if (response.data.drinks) {
					setDrinks(response.data.drinks);
				} else {
				}
			});
			*/
		} else {
			setHasSearched(false);
		}
		/*
            CocktailService.getCocktailByIngredient(searchQuery).then(
                (response) => {
                    if (response.data.drinks) {
                        setDrinks(response.data.drinks);
                    } else {
                        setDrinks([]);
                    }
                }
            );
        */
	};

	useEffect(() => {
		if (!hasSearched) {
			CocktailService.getRandomCocktail().then((response) => {
				setDrinks(response.data.drinks);
			});
		}
	}, [hasSearched]);

	const handleChangeSearch = (input) => {
		setSearchQuery(input.target.value);
	};

	return (
		<div style={styles.container}>
			<div
				onClick={() => {
					setSearchQuery("");
					setHasSearched(false);
				}}
				style={{ cursor: "pointer" }}
			>
				<Typography variant="h2" align="center">
					The Cocktail Encyclopedia
				</Typography>
			</div>
			<TextField
				value={searchQuery}
				onChange={handleChangeSearch}
				onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
				placeholder="Tequila sunrise, lime, tonic"
				color="primary"
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton onClick={handleSearch}>
								<SearchIcon />
							</IconButton>
						</InputAdornment>
					),
				}}
				style={{
					marginTop: !hasSearched ? 50 : 20,
					maxWidth: "80%",
					width: 600,
				}}
			/>
			{!hasSearched ? (
				<Typography
					variant="h5"
					align="center"
					style={{ marginTop: 40, marginBottom: 20 }}
				>
					Have you tried...
				</Typography>
			) : (
				""
			)}
			<Container style={{ marginTop: hasSearched ? 40 : 0 }}>
				<Grid
					container
					spacing={2}
					justify={hasSearched ? "flex-start" : "center"}
				>
					{drinks.map((drink, index) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							key={drink.idDrink}
						>
							<CocktailCard drinkId={drink.idDrink} key={index} />
						</Grid>
					))}
				</Grid>
			</Container>
			{drinks.length === 0 ? (
				<Typography>No search results</Typography>
			) : (
				""
			)}
		</div>
	);
}

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		paddingTop: 60,
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
	searchContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	searchBar: {
		borderRadius: 8,
		border: "1px solid white",
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
