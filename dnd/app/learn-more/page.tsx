import Title from "@/components/Title";
import LearnMoreContent from "@/components/learn-more/LearnMoreContent";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import Markdown, { Components } from "react-markdown";

const LearnMorePage = () => {
  const markdownComponentsFun: (b?: boolean) => Components = (newTab) => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      p: ({ node, ref, ...props }) => <Typography {...props} />,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      a: ({ node, ref, ...props }) => (
        <Link
          href="/feedback"
          {...props}
          target={newTab ? "_blank" : "_self"}
          style={{ textDecoration: "underline" }}
        />
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      li: ({ node, ref, ...props }) => <Typography {...props} component="li" />,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      h1: ({ node, ref, ...props }) => <Typography {...props} component="h1" />,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      h2: ({ node, ref, ...props }) => <Typography {...props} component="h2" />,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      h3: ({ node, ref, ...props }) => (
        <Typography {...props} component="h3" sx={{ fontSize: 20 }} />
      ),
    };
  };
  const markdownComponents = markdownComponentsFun();
  const markdownComponentsNewTab = markdownComponentsFun(true);

  const aboutMarkdown = `The Dungeons and Dragons AI generator aims to assist dungeon masters
  with creating and managing their campaigns. All aspects of your
  campaign such as character generation/management, campaign event
  progression, music/audio generation, and map generation are all
  possible through our interface. For any concerns, be sure to either
  fill out our [feedback form](/feedback) or contact us at 3069391
  <at> gmail <dot> com.`;

  const characterGenerationMarkdown = `### **About the Character Generator**
  You can create characters, npcs, and enemies through our Character Generator. You can either auto-generate the character information with a starter prompt, or you can create the character manually. 
  Either way, there will be a generate button at the top right of the form. By clicking that, our AI will start to fill out any remaining unfilled form fields for your character. Feel free to edit 
  any of the AI's suggestions—it's your character after all! Once you finish creating your character, an AI-generated portrait of your character will start generating. You will be notified once it finishes.
  
  ### **Editing Characters**
  You can see all your created characters, npcs, and enemies on the Character Generator tab. By clicking on a character's card, you will be sent to a details page for that character, containing all of 
  their character information. There, you can edit your character by clicking the edit button in the top right.
  
  ### **Editing a Character's Portrait**
  In order to recreate a character's portrait, go to the details page for that character, edit the character by clicking on the edit button, and change the appearance form field to the new appearance you 
  want the character's portrait to have. Then, a new portrait will begin generating automatically.
  
  ### **Exporting to a PDF Character Sheet**
  To export your character details to a PDF character sheet, go to the details page for that character, then click on the export to PDF button. Note that your character's portrait must be finished generating
  before you will be able to export to a PDF character sheet since we include your portrait in the character sheet.
  `;

  const campaignPlayerMarkdown = `### **About the Campaign Player**
  The campaign player is designed for you as a DM to log all the events that happen in your campaign. We separate your campaign into *arcs*. As a DM, you can decide how long each arc is, but we intend that
  each arc has a clear story progression within your overall campaign. As an example, a one-shot campaign might just entail one arc, but a longer campaign may entail multiple.

  ### **Logging Events**
  DnD campaigns are very dynamic and are often shaped by the decisions of the party members, so the DM has to react to these decisions on-the-fly. We want to assist DMs with on-the-fly ideas using our AI assistant.
  Anytime a player makes a decision, fails a skill check, wins in combat, or any of the numerous other actions they can take, feel free to log this as an event in your arc by typing up the event and submitting it 
  either with the submit button or \`enter\` key. By logging these events, you give the AI assistant the full context of your current arc which will assist it in generating ideas. We recommend that player decisions 
  as well as ideas that you as the DM create for the story to progress all be logged as events so the AI has the most amount of contextual information.

  ### **Stuck? As the AI for help**
  Lots of times with DnD campaigns, the story that the DM initially has in their head will unravel as unpredictable events occur. This means the DM has to think of new ways for the story to progress on-the-fly.
  If you are ever stuck, flip the switch on the bottom right of the screen to turn the Campaign Player into AI mode. The textbox normally used for logging events will now serve as a prompt you can give to the AI.
  This prompt is optional, but once you are ready for help, click the submit button or press the \`enter\` key like you would do to log an event. Then, the AI will come up with three different ideas you can use.
  Each idea follows an RPG-style game where one idea is positive and friendly, another is neutral, and the third has an antagonistic and confrontational tone. You can choose any of these suggestions or regenerate
  everything with the redo button on the top right. Once you choose an idea, it will be copied over into the event logging textbox for you to edit if necessary. Once you are ready, submit it as an event and continue
  your campaign! 

  ### **Done with your arc?**
  When you are done with your arc and ready to start a new one, you can click the check button in the top right. By "completing" your arc, you can see it as completed in the Timeline Viewer tab.
  Completed arcs will have a name, summary, and picture generated for them by our AI assistants. By completing your arc, you will also be able to revert to that completed arc in case your campaign gets 
  derailed. For more information, see the information for the [Timeline Viewer](/learn-more#timeline).
  `;

  const mapGeneratorMarkdown = `### **About the Map Generator**
  The map generator—like its name implies—allows you to generate map images for your campaign. When starting your campaign, by going to the Map Generator tab, you will be able to describe how the world of your
  campaign looks to our AI assistant so that it can generate a world map. After creating a world map, you will be able to generate any number of maps for any arc of your campaign. Dungeons, valleys, taverns, cities, 
  forests, you name it! Note that for maps requiring fine-grained detail—especially for movement grids for combat-based maps—it might be best to create maps manually using other [websites](https://app.dungeonscrawl.com/).
  
  ### **Creating and Editing Maps**
  To create a map, simply click the add button like you would do to create a character. You will be shown a screen to type up a description of what you want your map to look like. After hitting submit, the AI will 
  generate your map in the background. Like with the other areas of image generation on our site, this will happen in the background—meaning that you can leave the Map Generator tab and will be notified once the map 
  has finished generating. If you don't like how the map turned out, you can edit it and type in a new prompt. Don't be afraid to be descriptive with your prompts! The more in-depth the prompt, the more information the AI
  has to work with. If you want to delete a map entirely, simply click the delete button.
  `;

  const musicGeneratorMarkdown = `### **About the Music Generator**
  Increase immersion by playing any of our AI-generated audio. We have a variety of audio samples ranging from music, ambient sounds, weather, and much more. Once you switch to the music generation tab, you will be presented
  with each of these types of audio samples. Pick which one you like and you will have a couple of variants to choose from. For instance, clicking on the *Ambience* audio button will show you options to generate ambient audio 
  for dungeons, taverns, caves, and more. Once you select which audio you want to listen to, you will see audio controls on that screen including a pause/play button and volume slider. You can leave the Music Generator tab 
  while your audio is playing and it will continue to play. As an example, you could play sounds of a dark and spooky forest while on the Campaign Player tab logging new events as your party members respond to the world around
  them. To turn off the music while in another tab, simply click the orange audio button you will see on the bottom right of your screen. 
  `;

  const timelineViewerMarkdown = `### **About the Timeline Viewer**
  In the Timeline Viewer, you will be able to see all of your completed arcs in your campaign. Once a campaign arc has been completed, our AI will generate a name, summary, and picture for that arc using the events that you
  logged for it in the [Campaign Player](/learn-more#campaign-player). The generation of this arc information will take some time, but you can return to other parts of the site while this generation happens in the background. 
  Each completed arc in the Timeline Viewer will have the AI-generated name, summary, and picture for that arc as well as all the events you logged for it and the maps you generated for it. Each arc will also have a rewind button.
  Clicking this rewind button will rewind your campaign to the end of where that arc left off. This is intended for when your campaign unexpectedly gets derailed and you want to return to a point at which all your party
  members were still happy and engaged with the campaign.
  `;

  return (
    <Stack alignItems="center">
      <Title>Learn More</Title>
      <Stack width={{ xs: "100%", sm: "90%", md: "75%" }} m={4} spacing={4}>
        <LearnMoreContent title="About" id="about">
          <Markdown components={markdownComponents}>{aboutMarkdown}</Markdown>
        </LearnMoreContent>
        <LearnMoreContent title="Character Generator" id="character-generator">
          <Markdown components={markdownComponents}>
            {characterGenerationMarkdown}
          </Markdown>
        </LearnMoreContent>
        <LearnMoreContent title="Campaign Player" id="campaign-player">
          <Markdown components={markdownComponents}>
            {campaignPlayerMarkdown}
          </Markdown>
        </LearnMoreContent>
        <LearnMoreContent title="Map Generator" id="map-generator">
          <Markdown components={markdownComponentsNewTab}>
            {mapGeneratorMarkdown}
          </Markdown>
        </LearnMoreContent>
        <LearnMoreContent title="Music Generator" id="music-generator">
          <Markdown components={markdownComponents}>
            {musicGeneratorMarkdown}
          </Markdown>
        </LearnMoreContent>
        <LearnMoreContent title="Campaign Timeline" id="timeline">
          <Markdown components={markdownComponents}>
            {timelineViewerMarkdown}
          </Markdown>
        </LearnMoreContent>
      </Stack>
    </Stack>
  );
};

export default LearnMorePage;
