import { secondaryButtonStyles } from "@/lib/theme";
import { Character } from "@/lib/types";
import { Box, ButtonBase, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React, { useContext } from "react";
import { TabContext } from "../../tab-pages/TabProvider";
import ImageGenerating from "../../ImageGenerating";
import { boxShadow } from "@/lib/utils";

type Props = {
  character: Character;
};
const cardStyles = {
  ...secondaryButtonStyles,
  borderRadius: 3,
};

const CharacterCard = ({ character }: Props) => {
  const { setCharacterQuery } = useContext(TabContext);
  const placeholder = "N/A";
  return (
    <Paper sx={{ ...cardStyles, boxShadow }} elevation={6}>
      <ButtonBase
        onClick={() =>
          setCharacterQuery(character?.name || "", { history: "push" })
        }
        sx={{
          width: "300px",
          ...cardStyles,
          "& .MuiTypography-root": {
            // Increase specificity by targeting MuiTypography within MuiButtonBase
            color: "#e1e1e1",
          },
        }}
      >
        <Stack spacing={2} alignItems="center" p={2} width="100%">
          <Typography gutterBottom variant="h2" fontSize={30}>
            {character.name}
          </Typography>
          <Box width={200} height={200} position="relative">
            {character.picture ? (
              <Image
                src={character.picture}
                alt={character.name || ""}
                fill
                sizes="200px"
                style={{ objectFit: "contain" }}
              />
            ) : (
              <ImageGenerating />
            )}
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            px={4}
          >
            <Stack alignItems="flex-start">
              <Typography>{`Race: ${character.race || placeholder}`}</Typography>
              <Typography>{`Class: ${character.class || placeholder}`}</Typography>
            </Stack>

            <Stack alignItems="flex-start">
              <Typography>{`HP: ${character.hp || placeholder}`}</Typography>
              <Typography>{`AC: ${character.ac || placeholder}`}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </ButtonBase>
    </Paper>
  );
};

export default CharacterCard;
