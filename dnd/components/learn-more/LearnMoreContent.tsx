import { Divider, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  id: string;
};

const LearnMoreContent = ({ children, title, id }: Props) => {
  return (
    <Stack
      spacing={3}
      id={id}
      sx={{ scrollMarginTop: 64, backgroundColor: "#1E053D" }}
      p={6}
      pt={5}
      borderRadius={3}
    >
      <Stack direction="row">
        <Stack>
          <Typography gutterBottom variant="h2" fontSize={35}>
            {title}
          </Typography>
          <Divider flexItem sx={{ width: "calc(100% + 25px)" }} />
        </Stack>
        <div style={{ flexGrow: 1 }} />
      </Stack>
      {children}
    </Stack>
  );
};

export default LearnMoreContent;
