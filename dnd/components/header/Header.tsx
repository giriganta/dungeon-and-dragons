"use client";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDAndD } from "@fortawesome/free-brands-svg-icons";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderDrawer from "./HeaderDrawer";
import Link from "next/link";
import ProfileButton from "./ProfileButton";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          width: "100vw",
        }}
      >
        <IconButton
          onClick={handleDrawerOpen}
          edge="start"
          size="large"
          sx={{ mr: { md: 4, xs: 1, sm: 2 } }}
        >
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
        <Box onClick={handleDrawerClose}>
          <HeaderDrawer
            isOpen={drawerOpen}
            openDrawer={handleDrawerOpen}
            closeDrawer={handleDrawerClose}
          />
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={2}
        >
          <Link href="/">
            <Stack direction="row" spacing={3} alignItems="center">
              <FontAwesomeIcon icon={faDAndD} style={{ fontSize: 30 }} />
              <Box display={{ xs: "none", sm: "block" }}>
                <Typography variant="h2" fontSize={20}>
                  Dungeons and Dragons Generator
                </Typography>
              </Box>
              <Box display={{ sm: "none" }}>
                <Typography variant="h2" fontSize={20}>
                  DnD Generator
                </Typography>
              </Box>
            </Stack>
          </Link>
          <ProfileButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
