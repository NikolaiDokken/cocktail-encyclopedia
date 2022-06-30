import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Cocktails from "./views/Cocktails";
import Layout from "./components/Layout";

const theme = createTheme({
    palette: {
        primary: { main: "#F9F9F9" },
        secondary: { main: "#E0DBD4" },
        text: { primary: "#F9F9F9", secondary: "#636060" },
        background: { default: "#1B1917", paper: "#313030" },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
                <Cocktails />
            </Layout>
        </ThemeProvider>
    );
}
