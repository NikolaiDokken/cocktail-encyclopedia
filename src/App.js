import React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Home from "./views/Home";

const theme = createMuiTheme({
	palette: {
		primary: { main: "#fc0303" },
		secondary: { main: "#ffffff" },
		text: { primary: "#ffffff" },
	},
	typography: {
		allVariants: {
			color: "#ffffff",
		},
	},
});

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<Home />
		</ThemeProvider>
	);
}
