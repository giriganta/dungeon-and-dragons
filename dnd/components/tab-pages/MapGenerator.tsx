import { Button, Divider, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import TabTitle from "../TabTitle";
import { StoryArc } from "@/lib/types";
import PromptModal from "../PromptModal";
import {
  createLoadingArcMap,
  createLoadingWorldMap,
  generateMapImage,
  setArcMaps,
} from "@/lib/firebase-mutate-actions";
import { TabContext } from "./TabProvider";
import MapImage from "../map/MapImage";
import ArcMaps from "../map/ArcMaps";

type Props = {
  campaignId: string;
  arcs: StoryArc[];
  worldMap: string | null;
};

type ModalSelection = "world-map" | "arc-map" | null;

const MapGenerator = ({ campaignId, worldMap, arcs }: Props) => {
  const { toastMap } = useContext(TabContext);
  const [modalOpen, setModalOpen] = useState<ModalSelection>(null);
  const [prompt, setPrompt] = useState("");
  const [imageToEdit, setImageToEdit] = useState("");
  const [arcIndexToEdit, setArcIndexToEdit] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const noWorldMap = worldMap === null;
  const worldMapToast = "Your campaign world map has finished generating";
  const arcMapToast = "Your campaign map has finished generating";

  function closeModal() {
    setModalOpen(null);
    setPrompt("");
  }

  async function createWorldMap() {
    setLoading(true);

    await createLoadingWorldMap(campaignId, worldMap);
    generateMapImage(campaignId, prompt, () =>
      toastMap(campaignId, worldMapToast)
    );

    setImageToEdit("");
    setLoading(false);
    closeModal();
  }

  async function createArcMap() {
    setLoading(true);

    const arcIndex = arcIndexToEdit;
    await createLoadingArcMap(campaignId, arcIndex);
    generateMapImage(
      campaignId,
      prompt,
      () => toastMap(campaignId, arcMapToast),
      arcIndex,
      [...arcs[arcIndex].maps, ""]
    );

    setLoading(false);
    closeModal();
  }

  async function editArcMap() {
    setLoading(true);

    const arcIndex = arcIndexToEdit;
    const arcMapsWithEmptyEditingMap = arcs[arcIndex].maps.map((imageUrl) =>
      imageUrl == imageToEdit ? "" : imageUrl
    );
    await setArcMaps(
      campaignId,
      arcIndex,
      arcMapsWithEmptyEditingMap,
      imageToEdit
    );
    generateMapImage(
      campaignId,
      prompt,
      () => toastMap(campaignId, arcMapToast),
      arcIndex,
      arcMapsWithEmptyEditingMap
    );

    // reset
    setImageToEdit("");
    setArcIndexToEdit(-1);
    setLoading(false);
    closeModal();
  }

  function handleSubmit() {
    if (noWorldMap || imageToEdit == worldMap) {
      createWorldMap();
    } else if (imageToEdit) {
      editArcMap();
    } else {
      createArcMap();
    }
  }

  function handleEditWorldMap() {
    setImageToEdit(worldMap as string);
    setModalOpen("world-map");
  }

  function handleEditArcMap(arcImageUrl: string) {
    setImageToEdit(arcImageUrl);
    setModalOpen("arc-map");
  }

  async function handleDeleteArcMap(arcIndex: number, arcImageUrl: string) {
    setDeleteLoading(arcImageUrl);
    const arcMapsAfterDeletion = arcs[arcIndex].maps.filter(
      (imageUrl) => imageUrl != arcImageUrl
    );
    await setArcMaps(campaignId, arcIndex, arcMapsAfterDeletion, arcImageUrl);
  }

  const title =
    modalOpen == "world-map" ? "Describe Your World Map" : "Describe Your Map";
  const description =
    modalOpen == "world-map"
      ? "This will help the AI with creating a map for the world your campaign is set in"
      : "This will help the AI with creating a map for your campaign";

  function adjustIndex(index: number) {
    // since we are reversing the arcs, make it so we adjust this index for firebase related operations
    return arcs.length - 1 - index;
  }

  return (
    <Stack flexGrow={1} alignItems="center" spacing={4} width="100%">
      <TabTitle title="Map Generator" fragment="map-generator" />
      {noWorldMap ? (
        <Stack flexGrow={1} pb={8} justifyContent="center" alignItems="center">
          <Button
            sx={{ p: 3, width: "75%", fontSize: 16 }}
            onClick={() => setModalOpen("world-map")}
          >
            Create a World Map of your Campaign
          </Button>
        </Stack>
      ) : (
        <>
          {/* Arc Maps */}
          {arcs
            .slice()
            .reverse()
            .map((arc, index) => (
              <ArcMaps
                key={adjustIndex(index)} // arcs never change order or get added/deleted while in this component, so this is okay
                handleEdit={(imageUrl) => handleEditArcMap(imageUrl)}
                handleDelete={(imageUrl) =>
                  handleDeleteArcMap(adjustIndex(index), imageUrl)
                }
                deleteLoading={deleteLoading}
                arcName={arc.name}
                arcMaps={arc.maps}
                handleAddMap={() => {
                  setModalOpen("arc-map");
                  setArcIndexToEdit(adjustIndex(index));
                }}
              />
            ))}
          {/* World Map */}
          <Stack alignItems="center" spacing={1}>
            <Stack spacing={2}>
              <Typography variant="h2" fontSize={32}>
                Campaign Map
              </Typography>
              <Divider flexItem sx={{ width: "125%", alignSelf: "center" }} />
            </Stack>
            <MapImage
              image={worldMap}
              alt="World Map"
              onEdit={handleEditWorldMap}
            />
          </Stack>
        </>
      )}

      <PromptModal
        open={modalOpen !== null}
        onClose={closeModal}
        prompt={prompt}
        onChange={setPrompt}
        title={title}
        description={description}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Stack>
  );
};

export default MapGenerator;
