import { Character, CharacterType } from "@/lib/types";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CharacterCard from "./CharacterCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { primaryButtonStyles } from "@/lib/theme";
import { characterTypeMapping } from "@/lib/utils";

type Props = {
  title: string;
  characters: Character[];
  type: CharacterType;
  handleAddCharacter: () => void;
};

const CharacterCardGrid = ({
  title,
  characters,
  type,
  handleAddCharacter,
}: Props) => {
  return (
    <Stack
      pt={2}
      pb={6}
      alignItems="center"
      spacing={2}
      maxWidth="90%"
      minWidth={characters.length ? "50%" : "25%"}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h2" fontSize={35} textAlign="center">
          {title}
        </Typography>
        <Tooltip title={`Add New ${characterTypeMapping[type]}`}>
          <IconButton sx={primaryButtonStyles} onClick={handleAddCharacter}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider flexItem />
      {characters.length > 0 ? (
        <Grid
          container
          justifyContent="space-evenly"
          rowGap={4}
          columnSpacing={2}
        >
          {characters.map((character) => (
            <Grid
              item
              key={character.name}
              md={4}
              sm={6}
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              minWidth="300px"
            >
              <CharacterCard character={character} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Button variant="contained" onClick={handleAddCharacter}>
          {`Add a new ${characterTypeMapping[type]}`}
        </Button>
      )}
    </Stack>
  );
};

export default CharacterCardGrid;
