"use client";

import Title from "@/components/Title";
import theme from "@/lib/theme";
import { NextErrorPageProps } from "@/lib/types";
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const CampaingErrorPage = ({ reset }: NextErrorPageProps) => {
  const buttonSx = {
    py: 1,
    px: 2,
  };
  return (
    <Stack alignItems="center" spacing={2}>
      <Title>Oh no!</Title>
      <Typography gutterBottom variant="h2" fontSize={40} sx={{ pb: 4 }}>
        There was an error loading your campaign
      </Typography>
      <Stack
        direction="row"
        spacing={4}
        justifyContent="space-evenly"
        py={4}
        px={8}
        bgcolor={theme.palette.primary.main}
        borderRadius={5}
      >
        <Button
          sx={{ ...buttonSx, px: 3.5 }}
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Link href="/">
          <Button sx={buttonSx}>Go Back to Home</Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default CampaingErrorPage;
