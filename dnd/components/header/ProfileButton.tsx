"use client";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { signOut } from "@/lib/firebase/auth";
import React, { useState } from "react";
import { useUser } from "@/lib/hook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

const ProfileButton = () => {
  const { user, loading } = useUser();
  const [profileDropdownAnchor, setProfileDropdownAnchor] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const openProfileDropdown = Boolean(profileDropdownAnchor);
  const router = useRouter();

  return (
    !loading &&
    user && (
      <>
        <Box sx={{ pr: { md: 3, sm: 2, xs: 1 } }}>
          <IconButton
            aria-label="profile"
            aria-controls={openProfileDropdown ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openProfileDropdown ? "true" : undefined}
            onClick={(e) => setProfileDropdownAnchor(e.currentTarget)}
          >
            <AccountCircleIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={profileDropdownAnchor}
          open={openProfileDropdown}
          onClose={() => setProfileDropdownAnchor(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
            sx: { py: 0 },
          }}
        >
          {/* Menu Buttons */}
          <MenuItem
            sx={{
              display: "flex",
              p: 1.5,
              mb: -1,
              justifyContent: "center",
            }}
            onClick={() => {
              router.push("/profile");
              setProfileDropdownAnchor(null);
            }}
          >
            Your Profile
          </MenuItem>
          <Divider />
          <MenuItem
            sx={{
              p: 1.5,
              display: "flex",
              justifyContent: "center",
              mt: -1,
            }}
            onClick={() => {
              signOut();
              setProfileDropdownAnchor(null);
              router.push("/");
            }}
          >
            Sign Out
          </MenuItem>
        </Menu>
      </>
    )
  );
};

export default ProfileButton;
