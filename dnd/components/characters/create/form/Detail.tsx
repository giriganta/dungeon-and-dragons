import { Divider, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  value: number | string | string[];
  type?: string;
  large?: boolean;
  extraLarge?: boolean;
};

const Detail = ({ label, value, type, large, extraLarge }: Props) => {
  const placeholder = "N/A";
  const valueToDisplay =
    value === placeholder || (type === "number" && isNaN(Number(value)))
      ? placeholder
      : value;

  return (
    <Stack spacing={1} alignItems={{ sm: "flex-start", xs: "center" }}>
      <Stack position="relative" width="fit-content">
        <Typography
          fontSize={extraLarge ? { md: 22, sm: 18, xs: 22 } : large ? 20 : 18}
          fontWeight="bold"
        >
          {label}
        </Typography>
        <Divider
          flexItem
          sx={{
            alignSelf: { sm: "flex-start", xs: "center" },
            width: "calc(100% + 15px)",
          }}
        />
      </Stack>
      <Typography
        fontSize={extraLarge ? { md: 22, sm: 18, xs: 22 } : large ? 18 : 16}
      >
        {valueToDisplay}
      </Typography>
    </Stack>
  );
};

export default Detail;
