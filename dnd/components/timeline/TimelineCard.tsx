import { StoryArc } from "@/lib/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import theme, { primaryButtonStyles, secondaryButtonStyles } from "@/lib/theme";
import ReplayIcon from "@mui/icons-material/Replay";
import Image from "next/image";
import { useContext, useState } from "react";
import { TabContext } from "../tab-pages/TabProvider";
import ImageGenerating from "../ImageGenerating";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DEFAULT_ARC_NAME } from "@/lib/utils";
import StyleScroll from "../StyleScroll";

type Props = {
  arc: StoryArc;
  handleRewind: () => void;
};

const IMAGE_WIDTH = 150;

const TimelineCard = ({ arc, handleRewind }: Props) => {
  const [eventsAccordionExanded, setEventsAccordionExpanded] = useState(false);
  const { viewCharacter, viewNPC, campaignTimelineQuery } =
    useContext(TabContext);

  return (
    <Paper
      id={arc.name}
      sx={{
        p: 3,
        border:
          campaignTimelineQuery == arc.name
            ? `5px solid ${theme.palette.secondary.main}`
            : undefined,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h3" fontSize={30}>
            {arc.name}
          </Typography>

          <Tooltip title="Rewind Back to this Arc">
            <IconButton onClick={handleRewind} sx={primaryButtonStyles}>
              <ReplayIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box>
          {arc.image ? (
            <Image
              src={arc.image}
              alt={arc.name}
              width={IMAGE_WIDTH}
              height={IMAGE_WIDTH}
              style={{
                objectFit: "contain",
                float: "left",
                marginRight: "20px",
              }}
            />
          ) : (
            <ImageGenerating
              sx={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }}
              size={30}
            />
          )}
          <Typography>{arc.details}</Typography>
        </Box>
        {/* Maps */}
        {arc.maps.length > 0 && (
          <>
            <Divider />
            <Stack>
              <Typography gutterBottom fontSize={22}>
                Maps:
              </Typography>

              <Stack direction="row" gap={2} flexWrap="wrap">
                {arc.maps.map((mapImage, index) =>
                  mapImage ? (
                    <Image
                      key={index}
                      sizes={`${IMAGE_WIDTH}px`}
                      src={mapImage}
                      alt={`${arc.name} map`}
                      width={IMAGE_WIDTH}
                      height={IMAGE_WIDTH}
                    />
                  ) : (
                    <ImageGenerating
                      key={index}
                      sx={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }}
                      size={30}
                    />
                  )
                )}
              </Stack>
            </Stack>
          </>
        )}
        {/* Characters section */}
        {(arc.characters.length > 0 || arc.npcs.length > 0) && <Divider />}
        {arc.characters.length > 0 && (
          <Stack>
            <Typography gutterBottom fontSize={22}>
              Characters involved:
            </Typography>
            <Stack direction="row" spacing={2}>
              {arc.characters.map((characterName) => (
                <Button
                  sx={{ ...secondaryButtonStyles }}
                  key={characterName}
                  onClick={() => viewCharacter(characterName)}
                >
                  {characterName}
                </Button>
              ))}
            </Stack>
          </Stack>
        )}
        {arc.npcs.length > 0 && (
          <Stack>
            <Typography gutterBottom fontSize={20}>
              NPCs involved:
            </Typography>
            <Stack direction="row" spacing={2}>
              {arc.npcs.map((characterName) => (
                <Button
                  sx={{ ...secondaryButtonStyles }}
                  key={characterName}
                  onClick={() => viewNPC(characterName)}
                >
                  {characterName}
                </Button>
              ))}
            </Stack>
          </Stack>
        )}

        {/* Events Accordion */}
        {arc.events.length > 0 && (
          <>
            <Divider />
            <Accordion
              expanded={eventsAccordionExanded}
              onChange={() =>
                setEventsAccordionExpanded(!eventsAccordionExanded)
              }
              sx={{ borderRadius: 1 }}
            >
              <AccordionSummary
                sx={{
                  mb: eventsAccordionExanded ? -2 : 0,
                }}
                expandIcon={
                  <ExpandMoreIcon
                    sx={{ color: theme.palette.primary.contrastText }}
                  />
                }
              >
                <Typography
                  style={{
                    color: theme.palette.primary.contrastText,
                  }}
                  fontSize={18}
                >{`Events in ${arc.name == DEFAULT_ARC_NAME ? "this arc" : arc.name}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <StyleScroll
                  sx={{
                    height: "200px",
                    alignItems: "flex-start",
                    py: 1,
                    px: 0.5,
                  }}
                  spacing={1.5}
                >
                  {arc.events.map((eventData) => (
                    <Paper
                      key={eventData.timestamp}
                      sx={{ p: 2 }}
                      elevation={3}
                    >
                      <Typography>{eventData.text}</Typography>
                    </Paper>
                  ))}
                </StyleScroll>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default TimelineCard;
