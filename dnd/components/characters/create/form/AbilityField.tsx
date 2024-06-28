import { Box, Divider, Stack, Typography } from "@mui/material";
import InputField from "./InputField";
import { AbilityFormData } from "@/lib/types";
import { ABILITY_COLOR_MAPPING } from "@/lib/utils";
import theme from "@/lib/theme";

type Props = AbilityFormData & {
  isEditing: boolean;
};

const placeholder = "N/A";

const AbilityField = ({
  base,
  modifier,
  isEditing,
  label,
  ...props
}: Props) => {
  const paperHeight = 95;
  const bottomPlacement = -18;
  const modifierHeight = 40;
  const backgroundColor = ABILITY_COLOR_MAPPING[label];
  const borderRadius = 8;

  return (
    <Box
      height={paperHeight + modifierHeight + bottomPlacement - 4}
      width="fit-content"
    >
      <Box
        sx={{
          boxShadow: "2px 4px 8px black",
          py: 1,
          px: 2,
          height: paperHeight,
          borderRadius: 4,
          width: 120,
          position: "relative",
        }}
      >
        <Stack alignItems="center" height="100%">
          <Stack
            alignItems="center"
            mb={-1}
            sx={{
              backgroundColor,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            }}
            width="110%"
          >
            <Typography fontWeight="bold">{label}</Typography>
            <Divider flexItem sx={{ width: "100%", alignSelf: "center" }} />
          </Stack>
          <Stack flexGrow={1} justifyContent="center">
            {isEditing ? (
              <InputField
                {...props}
                value={base || ""}
                label={""}
                type="number"
                inputMode="numeric"
                size="small"
                inputProps={{
                  sx: {
                    textAlign: "center",
                    "&[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "&::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "&::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  },
                }}
                sx={{
                  width: 70,
                }}
              />
            ) : (
              <Typography fontSize={18}>{base || placeholder}</Typography>
            )}
          </Stack>
          <Box
            sx={{
              height: modifierHeight,
              position: "absolute",
              bottom: bottomPlacement,
              width: 50,
              left: "50%",
              backgroundColor: theme.palette.info.dark,
              transform: "translateX(-50%)",
              padding: "4px 12px",
              borderRadius: 4,
              boxShadow: "2px 4px 2px black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid black",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>{modifier}</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AbilityField;
