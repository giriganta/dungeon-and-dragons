import { primaryButtonStyles } from "@/lib/theme";
import { DEFAULT_ARC_NAME, center } from "@/lib/utils";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import MapImage from "./MapImage";

type Props = {
  arcName: string;
  arcMaps: string[];

  handleAddMap?: () => void;
  handleEdit: (imageUrl: string) => void;
  handleDelete: (imageUrl: string) => void;
  deleteLoading: string;
};

const ArcMaps = ({
  arcName,
  arcMaps,
  handleAddMap,
  handleEdit,
  handleDelete,
  deleteLoading,
}: Props) => {
  const typographyProps: TypographyProps = {
    variant: "h2",
    fontSize: 32,
  };
  const arcDisplayName =
    arcName == DEFAULT_ARC_NAME ? "Your Current Arc" : arcName;
  return (
    <Stack alignItems="center" spacing={1}>
      <Stack alignItems="center" spacing={1}>
        <Stack direction="row" spacing={2} alignItems="center" pb={1}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            spacing={1}
            alignItems={{ xs: "center", md: "flex-start" }}
          >
            <Typography {...typographyProps}>Your Maps in:</Typography>
            <Typography
              {...typographyProps}
              fontStyle={arcName == DEFAULT_ARC_NAME ? "normal" : "italic"}
            >
              {arcDisplayName}
            </Typography>
          </Stack>
          <Tooltip title={`Add New Map`}>
            <IconButton sx={primaryButtonStyles} onClick={handleAddMap}>
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
          )
        </Stack>
        <Divider
          flexItem
          sx={{ width: "min(125%, 100% + 50px)", alignSelf: "center" }}
        />
      </Stack>
      {arcMaps.length ? (
        <Grid container justifyContent="center">
          {arcMaps.map((imageUrl) => (
            <Grid item key={imageUrl} md={6} xs={12} {...center} p={1.5}>
              <MapImage
                image={imageUrl}
                alt={`${arcDisplayName} map`}
                onEdit={() => handleEdit(imageUrl)}
                onDelete={() => handleDelete(imageUrl)}
                deleteLoading={deleteLoading == imageUrl && Boolean(imageUrl)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack sx={{ pt: 2 }}>
          <Button onClick={handleAddMap} sx={{ py: 1, px: 2 }}>
            Add a New Map
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ArcMaps;
