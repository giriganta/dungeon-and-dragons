import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AIPrompt,
  CampaignDocumentWithArcsArray,
  Character,
  EventData,
} from "@/lib/types";
import { User } from "firebase/auth";
import CampaignTitle from "../campaign/CampaignTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import InputIcon from "@mui/icons-material/Input";
import theme from "@/lib/theme";
import { useContext, useEffect, useRef, useState } from "react";
import {
  addEvent,
  generateArcInfo,
  removeEvent,
  saveArc,
} from "@/lib/firebase-mutate-actions";
import LinkSnackbar from "../snackbars/LinkSnackbar";
import { useSnackbar } from "notistack";
import { useStreamedResponse } from "@/lib/hook";
import EventViewer from "../campaign/EventViewer";
import AIOptions from "../campaign/AIOptionGrid";
import { TabContext } from "./TabProvider";

type Props = {
  user: User;
  campaignId: string;
  campaign: CampaignDocumentWithArcsArray;
};

const useOptimisticUpdate = (
  originalEvents: EventData[],
  campaignId: string,
  arcIndex: number
): [
  EventData[],
  (eventText: string) => Promise<void>,
  (eventData: EventData) => Promise<void>,
] => {
  const [events, setEvents] = useState<EventData[]>(originalEvents);
  useEffect(() => {
    setEvents(originalEvents);
  }, [originalEvents]);

  const addEventOptimistically = async (eventText: string) => {
    const optimisticEvent: EventData = {
      text: eventText,
      timestamp: Date.now(),
    };
    setEvents((currentEvents) => [...currentEvents, optimisticEvent]);

    try {
      await addEvent(campaignId, arcIndex, optimisticEvent);
    } catch (error) {
      // If the API call fails, remove the optimistically added event
      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event.timestamp !== optimisticEvent.timestamp
        )
      );
    }
  };

  const removeEventOptimistically = async (eventData: EventData) => {
    const oldEvents = [...events];
    setEvents(events.filter((event) => event.timestamp != eventData.timestamp));
    try {
      await removeEvent(campaignId, arcIndex, eventData);
    } catch (error) {
      // If the API call fails, revert the change
      setEvents(oldEvents);
    }
  };

  return [events, addEventOptimistically, removeEventOptimistically];
};

const PlayerPage = ({ user, campaignId, campaign }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { toastTimeline } = useContext(TabContext);
  const [currentEventText, setCurrentEventText] = useState("");
  const [usingAi, setUsingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<AIPrompt>({
    prompt: null,
    systemPrompt: "You are an assistant to a DnD dungeon master",
  });
  const { streamedData, setStreamedData } = useStreamedResponse(aiPrompt);
  const [savingArcLoading, setSavingArcLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const currentArc = campaign.arcs[campaign.arcs.length - 1];
  const [events, addEventOptimistically, removeEventOptimistically] =
    useOptimisticUpdate(
      currentArc.events,
      campaignId,
      campaign.arcs.length - 1
    );

  async function handleFormSubmit() {
    if (usingAi) {
      handleAIHelp();
    } else {
      await handleSubmitEvent();
    }
  }

  async function handleSubmitEvent() {
    if (currentEventText == "") {
      return;
    }
    setCurrentEventText("");
    await addEventOptimistically(currentEventText);
  }

  function handleAIHelp() {
    setCurrentEventText("");
    setStreamedData(""); // in case they redo the ai prompt

    /* Set up the characters for the prompt */
    const charactersForPrompt: Partial<Character>[] = Object.values(
      campaign.characters
    ).map((char) => {
      return {
        name: char.name,
        race: char.race,
        class: char.class,
      };
    });

    /* Set up events for the prompt */
    const N = 5;
    let mostRecentEvents = events.slice(-N);
    if (mostRecentEvents.length < N && campaign.arcs.length > 1) {
      const difference = N - mostRecentEvents.length;
      mostRecentEvents = [
        ...campaign.arcs[campaign.arcs.length - 2].events.slice(-difference),
        ...mostRecentEvents,
      ];
    }

    /* Create the prompt and send it to gpt */
    const prompt = `Create three suggestions with different tones (friendly, neutral, and antagonistic) for how this DnD campaign should continue.
The characters are ${JSON.stringify(charactersForPrompt)}.
${
  mostRecentEvents.length
    ? `These are the most recent events in chronological order: ${JSON.stringify(mostRecentEvents.map((eventData) => eventData.text))}`
    : `The campaign has just begun`
}.
${currentEventText}
Please format your response with these three suggestions like so (with no asterisks):
Friendly: Suggestion content here...

Neutral: Suggestion content here...

Antagonistic: Suggestion content here...`;

    setAiPrompt({ ...aiPrompt, prompt: prompt });
  }

  async function handleSaveArc() {
    setSavingArcLoading(true);
    const arcIndex = campaign.arcs.length - 1;
    await saveArc(campaignId, arcIndex);

    // asynchronously generate picture and summary name/description for this saved arc
    const previousArcSummary =
      arcIndex - 1 >= 0 ? campaign.arcs[arcIndex - 1].details : "";
    generateArcInfo(
      campaignId,
      arcIndex,
      previousArcSummary,
      events.map((eventData) => eventData.text),
      (arcName) => toastTimeline(campaignId, arcName)
    );

    setSavingArcLoading(false);
    enqueueSnackbar(
      <LinkSnackbar
        link={`/campaigns/${campaignId}?tab=timeline&arc=${currentArc.name}`}
        message="View Your Completed Arc"
      />,
      { variant: "custom" }
    );
  }

  const inputWidth = { md: "75%", sm: "80%", xs: "85%" };

  return (
    <Stack spacing={4} alignItems="center" flexGrow={1}>
      {/* Campaign name and edit button for campaign name */}
      <CampaignTitle
        user={user}
        campaignId={campaignId}
        title={campaign.name}
      />
      {/* Events / AI output */}
      {aiPrompt.prompt ? (
        <AIOptions
          streamedData={streamedData}
          onClick={(selectedOutput) => {
            setStreamedData("");
            setAiPrompt({ ...aiPrompt, prompt: null });
            setCurrentEventText(selectedOutput);
            setUsingAi(false);
          }}
          redoResponse={handleAIHelp}
        />
      ) : (
        <EventViewer
          events={events}
          savingArcLoading={savingArcLoading}
          removeEvent={removeEventOptimistically}
          handleSaveArc={handleSaveArc}
          numArcs={campaign.arcs.length}
        />
      )}
      {/* TextField input */}
      <Paper sx={{ p: 2.5, width: inputWidth, borderRadius: 3 }} elevation={6}>
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
            style={{ flexGrow: 1 }}
            ref={formRef}
          >
            <TextField
              multiline
              fullWidth
              value={currentEventText}
              onChange={(e) => setCurrentEventText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
              label={usingAi ? "Prompt" : "New Event"}
              color="success"
              placeholder={
                usingAi
                  ? "Prompt the AI for help"
                  : "Enter events as they happen"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ mr: -1, alignSelf: "flex-end", mb: 1.5 }}
                  >
                    <Tooltip title={usingAi ? "Submit Prompt" : "Submit Event"}>
                      <IconButton
                        type="submit"
                        aria-label={
                          usingAi ? "enter new prompt" : "enter new event"
                        }
                        sx={{
                          "&:hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                        onClick={handleFormSubmit}
                      >
                        <InputIcon color="info" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <Stack direction="column" alignItems="center">
            <Typography variant="button">Stuck? Ask AI for Ideas</Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Switch
                checked={usingAi}
                onChange={(e) => setUsingAi(e.target.checked)}
                color="secondary"
              />
              <Box sx={{ "&:hover": { cursor: "pointer" } }}>
                <FontAwesomeIcon
                  onClick={() => setUsingAi(!usingAi)}
                  fontSize={18}
                  icon={faRobot}
                  color={usingAi ? theme.palette.secondary.main : "gray"}
                />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default PlayerPage;
