import { Stack, SxProps } from "@mui/material";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  spacing?: number;
  sx?: SxProps;
};

const StyleScroll = ({ children, sx, spacing }: Props) => {
  return (
    <Stack
      alignItems="center"
      sx={{
        "&::-webkit-scrollbar": {
          width: "0.5rem",
          height: "1rem",
          backgroundColor: "transparent",
        },

        "&::-webkit-scrollbar-thumb": {
          borderRadius: "9999px",
          borderWidth: "1px",
          borderColor: "white",
          backgroundColor: "rgba(217, 217, 227, 0.8)",
        },

        "&::-webkit-scrollbar-track": {
          borderRadius: "9999px",
          backgroundColor: "transparent",
        },

        overflowY: "auto",
        ...sx,
      }}
      spacing={spacing}
    >
      {children}
    </Stack>
  );
};

export default StyleScroll;
