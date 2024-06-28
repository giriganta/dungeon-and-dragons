import theme from "@/lib/theme";
import { Weapon } from "@/lib/types";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import WeaponField from "./WeaponField";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  isEditing: boolean;
  weaponsArray: Weapon[];
  setWeapons: (w: Weapon[]) => void;
};

const WeaponsSection = ({ isEditing, weaponsArray, setWeapons }: Props) => {
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  // set the component mounted flag to true after the component mounts
  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  useEffect(() => {
    if (isComponentMounted && weaponsArray.length > 0) {
      setAccordionExpanded(true);
    }
  }, [isComponentMounted, weaponsArray]);

  return (
    <Accordion
      expanded={accordionExpanded}
      onChange={() => setAccordionExpanded(!accordionExpanded)}
      sx={{
        borderRadius: 1,
        backgroundColor: theme.palette.info.dark,
      }}
    >
      <AccordionSummary
        sx={{
          mb: accordionExpanded ? -2 : 0,
          color: theme.palette.primary.contrastText,
        }}
        expandIcon={
          <ExpandMoreIcon sx={{ color: theme.palette.primary.contrastText }} />
        }
      >
        <Typography fontSize={18}>{`Attacks`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {weaponsArray.map((weapon, index) => (
          <WeaponField
            key={index}
            weapon={weapon}
            onWeaponChange={(newWeapon) => {
              weaponsArray[index] = newWeapon;
              setWeapons([...weaponsArray]);
            }}
            onRemove={() => setWeapons(weaponsArray.filter((w) => w != weapon))}
            isEditing={isEditing}
          />
        ))}
        {isEditing && (
          <IconButton
            onClick={() => setWeapons([...weaponsArray, {}])}
            sx={{
              color: theme.palette.primary.contrastText,
              backgroundColor: "#304C59",
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default WeaponsSection;
