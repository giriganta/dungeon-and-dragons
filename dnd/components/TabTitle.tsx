import { Stack, Typography } from "@mui/material";
import LearnMoreButton from "./LearnMoreButton";

type Props = {
  title: string;
  fragment: string;
};

const TabTitle = ({ title, fragment }: Props) => {
  return (
    <Stack
      spacing={2}
      justifyContent="center"
      direction={{ xs: "column", sm: "row" }}
    >
      <Typography textAlign="center" gutterBottom variant="h1" fontSize={50}>
        {title}
      </Typography>
      <LearnMoreButton
        fragment={fragment}
        sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}
      />
    </Stack>
  );
};

export default TabTitle;
