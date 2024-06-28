import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { EventData } from "@/lib/types";
import { useEffect, useRef } from "react";
import StyleScroll from "../StyleScroll";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { secondaryButtonStyles } from "@/lib/theme";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import Loading from "../Loading";

type Props = {
  events: EventData[];
  savingArcLoading: boolean;
  removeEvent: (eventToRemove: EventData) => void;
  handleSaveArc: () => void;
  numArcs: number;
};

const EventViewer = ({
  events,
  savingArcLoading,
  removeEvent,
  handleSaveArc,
  numArcs,
}: Props) => {
  const bottomOfListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomOfListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      spacing={2}
      width={{ md: "60%", sm: "75%", xs: "85%" }}
    >
      {events.length > 0 ? (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            px={1}
            width="100%"
          >
            <IconButton sx={{ visibility: "hidden" }}>
              <DownloadDoneIcon />
            </IconButton>
            <Typography fontSize={26} textAlign="center" variant="h3">
              Your Events This Arc
            </Typography>
            <Tooltip title="Complete this Arc">
              <IconButton
                disabled={savingArcLoading}
                sx={{ ...secondaryButtonStyles }}
                onClick={handleSaveArc}
              >
                {/* <UploadIcon /> */}
                {savingArcLoading ? (
                  <Loading size={24} />
                ) : (
                  <DownloadDoneIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
          <StyleScroll
            sx={{
              flexGrow: 1,
              justifyContent: "flex-start",
              maxHeight: "280px",
              position: "relative",
              width: "100%",
              borderRadius: 1,
              px: 1,
            }}
          >
            {events.map((prevEvent, index) => (
              <Paper
                sx={{ p: 2, mt: index && 2, width: "100%" }}
                key={prevEvent.timestamp}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography sx={{ whiteSpace: "pre-line" }}>
                    {prevEvent.text}
                  </Typography>
                  {index == events.length - 1 && (
                    <Tooltip title="Delete Event">
                      <IconButton
                        sx={{
                          color: "rgba(0, 0, 0, 0.54)",
                          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                          alignSelf: "flex-start",
                        }}
                        onClick={() => removeEvent(prevEvent)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Paper>
            ))}
            <Box ref={bottomOfListRef} />
          </StyleScroll>
        </>
      ) : (
        <>
          <Typography
            textAlign="center"
            variant="h3"
            fontSize={28}
            gutterBottom
          >
            {`Begin Your ${numArcs == 1 ? "First" : "Next"} Arc`}
          </Typography>
          <Typography textAlign="center">
            Create an event to get started
          </Typography>

          <Link href="/learn-more#campaign-player">
            <Typography fontWeight={500}>Need Help?</Typography>
          </Link>
        </>
      )}
    </Stack>
  );
};

export default EventViewer;
