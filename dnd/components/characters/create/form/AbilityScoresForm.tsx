import { ALL_ABILITIES, AbilityFormData, Character } from "@/lib/types";
import { onAbilityChange, boxShadow, center } from "@/lib/utils";
import React from "react";
import AbilityField from "./AbilityField";
import Grid from "@mui/material/Grid";
import theme from "@/lib/theme";

type Props = {
  character: Character;
  setCharacter: (c: Character) => void;
  isEditing: boolean;
};

const AbilityScoresForm = ({ character, setCharacter, isEditing }: Props) => {
  const formAbilityFields: AbilityFormData[] = ALL_ABILITIES.map((ability) => {
    return {
      label: ability,
      ...character.abilities[ability],
      onChange: (val) => {
        onAbilityChange(character, val, ability);
        setCharacter({ ...character });
      },
    };
  });
  return (
    <Grid
      maxWidth="100%"
      container
      rowSpacing={1}
      px={2}
      pt={1}
      pb={2}
      bgcolor={theme.palette.info.dark}
      borderRadius={4}
      sx={{ boxShadow }}
    >
      {formAbilityFields.map((field) => (
        <Grid
          item
          key={field.label}
          {...center}
          px={{ xs: 0, sm: 2 }}
          md={2}
          sm={4}
          xs={6}
          width={100}
        >
          <AbilityField key={field.label} {...field} isEditing={isEditing} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AbilityScoresForm;
