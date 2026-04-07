import "../App.css";
import { useEffect, useRef, useState } from "react";
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
	const [error, setError] = useState(null);
	const abortControllerRef = useRef(null);

	const handleSearch = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();
		setError(null);
		const signal = abortControllerRef.current.signal;

		if (searchQuery.length > 0) {
			const cocktailsByName = CocktailService.getCocktailByName(
				searchQuery, signal
			);
			const cocktailsByIngredient = CocktailService.getCocktailByIngredient(
				searchQuery, signal
			);

			Promise.allSettled([cocktailsByName, cocktailsByIngredient]).then(
				(results) => {
					const rateLimited = results.some((r) => {
						if (r.status === "rejected") {
							return r.reason?.message === "Network Error" && !r.reason?.response;
						}
						if (r.status === "fulfilled") {
							const drinks = r.value?.data?.drinks;
							return typeof drinks === "string" && drinks.toLowerCase().includes("rate limit");
						}
						return false;
					});

					if (rateLimited) {
						setError("Rate limit exceeded. Please wait a moment before searching again.");
						return;
					}

					const nameResult = results[0].status === "fulfilled" ? results[0].value?.data?.drinks : null;
					const ingredientResult = results[1].status === "fulfilled" ? results[1].value?.data?.drinks : null;
					var drinksName = Array.isArray(nameResult) ? nameResult : [];
					const drinksIngredient = Array.isArray(ingredientResult) ? ingredientResult : [];

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

		} else {
			setHasSearched(false);
		}
	};

	useEffect(() => {
		if (!hasSearched) {
			CocktailService.getRandomCocktail()
				.then((response) => {
					setDrinks(response.data.drinks);
				})
				.catch((err) => {
					if (err.message === "Network Error" && !err.response) {
						setError("Rate limit exceeded. Please wait a moment before searching again.");
					} else {
						console.error(err);
					}
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
				error={!!error}
				helperText={error}
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
			{!error && drinks.length === 0 && (
				<Typography>No search results</Typography>
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
};
