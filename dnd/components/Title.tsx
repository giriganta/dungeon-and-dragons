import { SxProps, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  sx?: SxProps;
};

const Title = ({ children, sx }: Props) => {
  return (
    <Typography
      variant="h1"
      textAlign="center"
      fontSize={{ xs: 40, sm: 45, md: 50, lg: 70, xl: 80 }}
      sx={sx}
    >
      {children}
    </Typography>
  );
};

export default Title;
