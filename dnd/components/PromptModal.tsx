import { secondaryButtonStyles } from "@/lib/theme";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  prompt: string;
  onChange: (newPrompt: string) => void;
  title: string;
  description: string;
  onSubmit: () => void;
  loading?: boolean;
};

const PromptModal = ({
  open,
  onClose,
  prompt,
  onChange,
  title,
  description,
  onSubmit,
  loading,
}: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Paper sx={{ p: 3, width: { md: "50%", sm: "70%", xs: "80%" } }}>
        <Stack spacing={3} alignItems="center">
          <Stack spacing={2} alignItems="center">
            <Typography textAlign="center" fontSize={24} gutterBottom>
              {title}
            </Typography>
            <Typography textAlign="center">{description}</Typography>
          </Stack>

          <Stack spacing={1} width={{ md: "75%", xs: "100%" }}>
            <TextField
              label="Prompt"
              multiline
              value={prompt}
              onChange={(e) => onChange(e.target.value)}
            />
            <Stack
              direction="row"
              spacing={2}
              justifyContent={"flex-end"}
              width="100%"
            >
              <Button sx={secondaryButtonStyles} onClick={onClose}>
                Cancel
              </Button>
              <LoadingButton
                onClick={onSubmit}
                disabled={prompt == "" || loading}
                loading={loading}
              >
                Submit
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default PromptModal;
