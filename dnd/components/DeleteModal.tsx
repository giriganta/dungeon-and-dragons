import { secondaryButtonStyles } from "@/lib/theme";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Modal, Paper, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  loading: boolean;
  onSubmit: () => void;
  negativeText?: string;
  positiveText?: string;
};

const DeleteModal = ({
  open,
  onClose,
  title,
  description,
  loading,
  onSubmit,
  negativeText = "No, Cancel",
  positiveText = "Yes, Delete",
}: Props) => {
  const modalButtonSx = {
    py: 1,
    px: 3,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ p: 3, width: "50%" }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h3" fontSize={30}>
            {title}
          </Typography>
          <Typography textAlign="center" variant="h3" fontSize={18}>
            {description}
          </Typography>
          <Stack direction="row" spacing={4} pt={3}>
            <Button sx={modalButtonSx} onClick={onClose}>
              {negativeText}
            </Button>
            <LoadingButton
              loading={loading}
              disabled={loading}
              sx={{ ...secondaryButtonStyles, ...modalButtonSx }}
              onClick={onSubmit}
            >
              {positiveText}
            </LoadingButton>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default DeleteModal;
