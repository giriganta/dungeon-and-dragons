import Stack from "@mui/material/Stack";
import React from "react";
import { Weapon } from "@/lib/types";
import { IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import theme from "@/lib/theme";
import Detail from "./Detail";
import InputField from "./InputField";

type Props = {
  weapon: Weapon;
  onWeaponChange: (newWeapon: Weapon) => void;
  onRemove: () => void;
  isEditing: boolean;
};

const WeaponField = ({
  weapon,
  onWeaponChange,
  onRemove,
  isEditing,
}: Props) => {
  return (
    <Stack
      direction="row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isEditing ? (
        <InputField
          label="Name"
          value={weapon.name || ""}
          onChange={(val) => onWeaponChange({ ...weapon, name: val })}
        />
      ) : (
        <Detail label="Name" value={weapon.name || ""}></Detail>
      )}
      {isEditing ? (
        <InputField
          type="number"
          label="Attack Bonus"
          value={weapon.attack || ""}
          onChange={(val) => onWeaponChange({ ...weapon, attack: Number(val) })}
        />
      ) : (
        <Detail label="Attack Bonus" value={weapon.attack || ""}></Detail>
      )}
      {isEditing ? (
        <InputField
          label="Damage"
          value={weapon.damage || ""}
          onChange={(val) => onWeaponChange({ ...weapon, damage: val })}
        />
      ) : (
        <Detail label="Damage" value={weapon.damage || ""}></Detail>
      )}
      {isEditing ? (
        <InputField
          label="Type"
          value={weapon.type || ""}
          onChange={(val) => onWeaponChange({ ...weapon, type: val })}
        />
      ) : (
        <Detail label="Type" value={weapon.type || ""}></Detail>
      )}
      {/* Remove button */}
      {isEditing && (
        <IconButton
          onClick={onRemove}
          sx={{
            color: theme.palette.primary.contrastText,
            backgroundColor: "#304C59",
          }}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export default WeaponField;
