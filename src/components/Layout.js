import Navbar from "./Navbar";
import { styled, Box } from "@mui/material";

export default function Layout({ children }) {
    const HeaderBox = styled("div")(({ theme }) => ({
        display: "flex",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    return (
        <div>
            <Navbar />
            <HeaderBox />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        width: 600,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {children}
                </Box>
            </Box>
            <div
                style={{
                    height: 100,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h4>© Nikolai Dokken</h4>
            </div>
        </div>
    );
}
