import { CircularProgress, Box, SxProps } from "@mui/material";
import React from "react";

type Props = {
  sx?: SxProps;
  size?: string | number;
};

const Loading = ({ sx, size }: Props) => {
  return (
    <Box display="flex" justifyContent="center" width="100%" sx={sx}>
      <CircularProgress size={size} sx={{ color: "#e1e1e1" }} />
    </Box>
  );
};

export default Loading;
