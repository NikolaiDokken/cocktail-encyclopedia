import React, { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Avatar, Button, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import useFirebaseAuth from "../utils/useFirebaseAuth";
import { signOut, auth, signInWithGoogle } from "../firebase";

const Navbar = () => {
    const theme = useTheme();
    const authUser = useFirebaseAuth();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: theme.palette.background.default,
                color: theme.palette.primary.main,
                px: 4,
            }}
        >
            <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                <Box sx={{ width: "108px", display: { xs: "none", md: "flex" } }} />
                <Box sx={{ width: "40px", display: { xs: "flex", md: "none" } }} />
                <Typography
                    variant="h2"
                    textAlign="center"
                    sx={{ fontSize: "24px", display: { xs: "none", sm: "flex" } }}
                >
                    The Cocktail Dictionary
                </Typography>
                <Typography
                    variant="h2"
                    textAlign="center"
                    sx={{ fontSize: "24px", display: { xs: "flex", sm: "none" } }}
                >
                    🍸 Cock Dic
                </Typography>
                {authUser ? (
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Innstillinger">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={authUser.displayName} src={authUser.photoURL} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => signOut(auth)}>
                                <Typography textAlign="center">Logg av</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex" }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<GoogleIcon />}
                            onClick={signInWithGoogle}
                            sx={{ display: { xs: "none", md: "flex" } }}
                        >
                            Sign in
                        </Button>
                        <AccountCircleOutlinedIcon
                            onClick={signInWithGoogle}
                            sx={{ display: { xs: "flex", md: "none", cursor: "pointer" }, fontSize: 40 }}
                        />
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;
