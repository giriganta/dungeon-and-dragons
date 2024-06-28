import { Stack, SxProps, Typography } from "@mui/material";
import React from "react";
import Loading from "./Loading";
import theme from "@/lib/theme";

type Props = {
  sx?: SxProps;
  size?: string | number;
};

const ImageGenerating = ({ sx, size }: Props) => {
  return (
    <Stack
      borderRadius={2}
      justifyContent="space-evenly"
      alignItems="center"
      height="100%"
      bgcolor="gray"
      sx={sx}
    >
      <Typography
        style={{
          color: theme.palette.primary.contrastText,
          textAlign: "center",
        }}
      >
        Generating Picture
      </Typography>
      <Loading size={size} />
    </Stack>
  );
};

export default ImageGenerating;
