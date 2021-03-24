import logo from "../logo.svg";
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
	Hidden,
	Container,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

export default function Home() {
	const [drinks, setDrinks] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = () => {
		if (searchQuery.length > 0) {
			CocktailService.getCocktailByName(searchQuery).then((response) => {
				if (response.data.drinks) {
					setDrinks(response.data.drinks);
				} else {
					setDrinks([]);
				}
			});
			setHasSearched(true);
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
			<Grid
				container
				justify="center"
				alignItems="center"
				style={{ marginTop: 60 }}
			>
				<Hidden smDown>
					<Grid item>
						<img
							src={logo}
							style={styles.appLogo}
							className="App-logo"
							alt="logo"
						/>
					</Grid>
				</Hidden>
				<Grid item>
					<Typography variant="h2" align="center">
						The Cocktail Encyclopedia
					</Typography>
				</Grid>
			</Grid>
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
				style={{ marginTop: !hasSearched ? 50 : 20 }}
			/>
			{!hasSearched ? (
				<Typography
					variant="h5"
					align="center"
					style={{ marginTop: 40 }}
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
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
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
