import { Card, CardActions, Stack, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import React from "react";
import LaunchIcon from "@mui/icons-material/Launch";
import Link from "next/link";

type Props = {
  message: string;
  link: string;
  sx?: SxProps<Theme>;
};

const LinkSnackbar = ({ message, link, sx }: Props) => {
  return (
    <Link href={link}>
      <Card
        sx={{
          backgroundColor: "#43a047",
          padding: "6px 16px",
          cursor: "pointer",
          color: "white",
          right: 5,
          ...sx,
        }}
      >
        <CardActions
          sx={{
            padding: "8px 8px 8px 16px",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" color="white">
            <Typography
              variant="body2"
              sx={{ fontSize: 15, textAlign: "center", color: "white" }}
            >
              {message}
            </Typography>
            <LaunchIcon />
          </Stack>
        </CardActions>
      </Card>
    </Link>
  );
};

export default LinkSnackbar;
