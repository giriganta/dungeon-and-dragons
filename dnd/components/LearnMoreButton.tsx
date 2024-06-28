import {
  Box,
  Button,
  IconButton,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import { secondaryButtonStyles } from "@/lib/theme";

type Props = {
  fragment?: string;
  sx?: SxProps;
};

const LearnMoreButton = ({ fragment, sx }: Props) => {
  return (
    <Box sx={sx}>
      <Link href={`/learn-more${fragment ? "#" + fragment : ""}`}>
        {fragment ? (
          <Tooltip title="Learn More">
            <IconButton sx={{ fontSize: 16, ...secondaryButtonStyles }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            sx={{
              fontSize: { md: 16, xs: 14 },
              py: 1,
              borderRadius: 4,
            }}
          >
            <Stack direction="row" spacing={1}>
              <Typography fontSize={15} variant="button">
                Learn More
              </Typography>
              <InfoIcon />
            </Stack>
          </Button>
        )}
      </Link>
    </Box>
  );
};

export default LearnMoreButton;
