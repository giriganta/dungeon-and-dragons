import { PDFDocument, PDFForm } from "pdf-lib";
import fs from "fs";
import path from "path";
import { ALL_ABILITIES, ALL_SKILLS, Character } from "@/lib/types";
import { characterSheetFilename } from "@/lib/utils";
import sharp from "sharp";

export async function POST(req: Request) {
  const { character: characterData } = await req.json();
  const character = characterData as Character;

  const formPdfPath = path.resolve("./pdf/character_sheet.pdf");
  const formPdfBytes = fs.readFileSync(formPdfPath);
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  // modify the form values in the pdf with their character's abilities
  const form = pdfDoc.getForm();
  fillOutForm(form, character);

  // add the character portrait to the pdf
  await addPictureToPdf(pdfDoc, character.picture as string);

  // save pdf to bytes
  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${characterSheetFilename(character.name || "")}"`,
    },
  });
}

function fillOutForm(form: PDFForm, character: Character) {
  // Direct mappings
  form.getTextField("CharacterName").setText(character.name);
  form.getTextField("Class").setText(character.class);
  form.getTextField("Level").setText(character.level?.toString() || "");
  form.getTextField("Background").setText(character.background);
  form.getTextField("Race ").setText(character.race);
  form.getTextField("Alignment").setText(character.alignment);
  form.getTextField("XP").setText(character.xp?.toString() || "");

  /* first column */
  // Assuming `abilities` is an object with keys for each ability (STR, DEX, CON, INT, WIS, CHA)
  // and each key maps to an object with `base` and `modifier` properties
  ALL_ABILITIES.forEach((abilityKey) => {
    const ability = character.abilities?.[abilityKey];
    if (ability) {
      const name = abilityKey.slice(0, 3).toUpperCase();
      const modFieldName =
        name == "DEX" ? "DEXmod " : name == "CHA" ? "CHamod" : `${name}mod`;
      form.getTextField(name).setText(ability.base?.toString() || "");
      form
        .getTextField(modFieldName)
        .setText(ability.modifier?.toString() || "");
    }
  });

  form
    .getTextField("Inspiration")
    .setText(character.inspiration_num?.toString() || "");
  form
    .getTextField("ProfBonus")
    .setText(character.proficiency_bonus?.toString() || "");

  // Saving throws
  ALL_ABILITIES.forEach((abilityKey, index) => {
    const savingThrow = character.saving_throws?.[abilityKey];
    if (savingThrow) {
      form
        .getTextField(`ST ${abilityKey}`)
        .setText(savingThrow.value?.toString() || "");
      if (savingThrow.proficient) {
        const indexInForm = index ? index + 17 : 11;
        form.getCheckBox(`Check Box ${indexInForm}`).check();
      }
    }
  });

  // SKILLS
  ALL_SKILLS.forEach((skillKey, index) => {
    const skill = character.skills?.[skillKey];
    if (skill) {
      const skillFieldName =
        skillKey == "Animal Handling"
          ? "Animal"
          : skillKey == "Sleight of Hand"
            ? "SleightofHand"
            : skillKey == "Deception" ||
                skillKey == "History" ||
                skillKey == "Investigation" ||
                skillKey == "Stealth" ||
                skillKey == "Perception"
              ? `${skillKey} `
              : skillKey;
      form.getTextField(skillFieldName).setText(skill.value?.toString() || "");
      if (skill.proficient) {
        form.getCheckBox(`Check Box ${index + 23}`).check();
      }
    }
  });
  form
    .getTextField("Passive")
    .setText(
      (character.skills.Perception.value
        ? character.skills.Perception.value + 10
        : 0
      ).toString()
    );
  form
    .getTextField("ProficienciesLang")
    .setText(character.proficiencies_array?.join("\n") || "");

  /* Second Column */

  form.getTextField("AC").setText(character.ac?.toString() || "");
  form
    .getTextField("Initiative")
    .setText(character.initiative?.toString() || "");
  form.getTextField("Speed").setText(character.speed?.toString() || "");
  form.getTextField("HPMax").setText(character.hp?.toString() || "");
  form.getTextField("HPCurrent").setText(character.hp?.toString() || "");
  form
    .getTextField("HPTemp")
    .setText(character.temp_hp ? character.temp_hp.toString() : "");
  form
    .getTextField("HDTotal")
    .setText(character.total_hit_dices?.toString() || "");
  form.getTextField("HD").setText(character.hit_dices?.toString() || "");

  // successes and failures
  for (let i = 0; i < (character.successes.length); i++) {
    if (character.successes[i]) {
      form.getCheckBox(`Check Box ${i + 12}`).check();
    }
  }
  for (let i = 0; i < (character.successes.length); i++) {
    if (character.failures[i]) {
      form.getCheckBox(`Check Box ${i + 15}`).check();
    }
  }

  // For attacks, you may need to handle them individually based on your structure
  // This is a placeholder for how you might handle the first weapon
  if (character.weapons_array) {
    const ATTACK_LIMIT_ON_FORM = 9; // only show 9 rows of attacks
    character.weapons_array
      .slice(0, ATTACK_LIMIT_ON_FORM)
      .forEach((attack, index) => {
        const attackBonusFieldSpaces =
          index == 1 ? " " : index == 2 ? "  " : "";
        const attackDamageFieldSpaces = index == 1 || index == 2 ? " " : "";
        form.getTextField(`Wpn Name ${index + 1}`).setText(attack.name);
        form
          .getTextField(`Wpn${index + 1} AtkBonus${attackBonusFieldSpaces}`)
          .setText(attack.attack?.toString() || "");
        form
          .getTextField(`Wpn${index + 1} Damage${attackDamageFieldSpaces}`)
          .setText(attack.damage);
      });
  }

  // Handling currencies
  form.getTextField("CP").setText(character.cp?.toString() || "");
  form.getTextField("SP").setText(character.sp?.toString() || "");
  form.getTextField("EP").setText(character.ep?.toString() || "");
  form.getTextField("GP").setText(character.gp?.toString() || "");
  form.getTextField("PP").setText(character.pp?.toString() || "");

  // equipment
  form
    .getTextField("Equipment")
    .setText(character.equipment_array?.join("\n") || "");

  /* Third Column */
  form.getTextField("PersonalityTraits ").setText(character.backstory);
  form
    .getTextField("Features and Traits")
    .setText(character.traits_array?.join("\n") || "");
}

async function addPictureToPdf(pdfDoc: PDFDocument, imageUrl: string) {
  const imageResponse = await fetch(imageUrl);
  const imageArrayBuffer = await imageResponse.arrayBuffer();

  // the fetched image is a webp file, so we need to change it to a jpeg
  const convertedImageBuffer = await sharp(Buffer.from(imageArrayBuffer))
    .jpeg() // Convert to JPEG; use .png() for PNG conversion
    .toBuffer();

  const embeddedImage = await pdfDoc.embedJpg(convertedImageBuffer);
  const { width, height } = embeddedImage.scale(0.12); // Scale of 1 for original size, adjust as needed

  // Add the image to the specified page at (x, y) coordinates
  const page = pdfDoc.getPages()[0];
  page.drawImage(embeddedImage, {
    x: 433,
    y: 352,
    width: width,
    height: height,
  });
}
