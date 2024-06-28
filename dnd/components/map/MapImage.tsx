import { Box, IconButton, Modal, Stack, Tooltip } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import ImageGenerating from "../ImageGenerating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import Delete from "@mui/icons-material/Delete";
import Loading from "../Loading";
import theme from "@/lib/theme";
import DeleteModal from "../DeleteModal";

type Props = {
  image: string;
  alt?: string;
  onEdit: () => void;
  onDelete?: () => void;
  deleteLoading?: boolean;
};

const MapImage = ({ image, alt, onEdit, onDelete, deleteLoading }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const disabled = image == "";
  const iconButtonSx = {
    p: 1.25,
  };
  const iconStyle = {
    color: disabled ? "gray" : theme.palette.primary.contrastText,
  };
  return (
    <>
      <Stack alignItems="center" width="fit-content" spacing={0.5}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignSelf: "flex-end",
          }}
        >
          <Tooltip
            title={
              disabled ? "Cannot Remake Map While Generating" : "Remake Map"
            }
          >
            <span>
              <IconButton
                disabled={disabled}
                onClick={onEdit}
                sx={iconButtonSx}
              >
                <FontAwesomeIcon icon={faPenToSquare} style={iconStyle} />
              </IconButton>
            </span>
          </Tooltip>
          {onDelete && (
            <Tooltip
              title={
                disabled ? "Cannot Delete Map While Generating" : "Delete Map"
              }
            >
              <span>
                <IconButton
                  disabled={disabled}
                  onClick={() => setDeleteModalOpen(true)}
                  sx={iconButtonSx}
                >
                  {deleteLoading ? (
                    <Loading size={22} />
                  ) : (
                    <Delete style={iconStyle} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Stack>
        <Box width={400} height={400} position="relative">
          {image ? (
            <Image
              onClick={() => setModalOpen(true)}
              src={image}
              alt={alt || ""}
              sizes="400px"
              fill
              style={{
                objectFit: "contain",
                borderStyle: "solid",
                borderWidth: "15px",
                borderTopColor: "#333333",
                borderRightColor: "#000",
                borderBottomColor: "#333333",
                borderLeftColor: "#000",
                boxShadow: "2px 2px 4px rgba(0,0,0,.6)",
                cursor: "pointer",
              }}
            />
          ) : (
            <ImageGenerating />
          )}
        </Box>
      </Stack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          position="relative"
          height="100%"
          width="100%"
          onClick={() => setModalOpen(false)}
        >
          <Image
            src={image}
            alt={alt || ""}
            fill
            style={{
              objectFit: "contain",
              zIndex: 1,
            }}
          />
          <Loading sx={{ position: "absolute", top: "50%", left: 8 }} />
        </Box>
      </Modal>
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Map"
        description="Are you sure you want to delete this map? All data for this map will be lost."
        loading={deleteLoading || false}
        onSubmit={onDelete as () => void}
      />
    </>
  );
};

export default MapImage;
