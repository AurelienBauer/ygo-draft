/* eslint-disable no-underscore-dangle */
import { JSONSchemaType } from "ajv";
import { DeckBuilderLoc, IBuildingDeckExport, ICard } from "../../types";

function isAnExtraDeckCard(c: ICard) {
  return c._type === "Fusion Monster"
  || c._type === "Ritual Effect Monster"
  || c._type === "Ritual Monster";
}

// eslint-disable-next-line import/prefer-default-export
export function canBeDropIn(
  c: ICard,
  originSection: DeckBuilderLoc,
  destSection: DeckBuilderLoc,
): boolean {
  const isAnExtraCard = isAnExtraDeckCard(c);
  switch (originSection) {
    case "deck":
      return destSection === "stock"
          // || (destSection === "deck" && !isAnExtraCard)
          || destSection === "bookmarked";
    case "extraDeck":
      return destSection === "stock" || destSection === "bookmarked";
    case "bookmarked":
      return destSection === "stock"
          || (destSection === "deck" && !isAnExtraCard)
          || (destSection === "extraDeck" && isAnExtraCard);
    case "stock":
      return destSection === "bookmarked"
          || (destSection === "deck" && !isAnExtraCard)
          || (destSection === "extraDeck" && isAnExtraCard);
    default:
      return false;
  }
}

const IBuildingDeckJSONSchema: JSONSchemaType<IBuildingDeckExport> = {
  type: "object",
  properties: {
    deck: {
      type: "array",
      items: {
        type: "number",
      },
    },
    extraDeck: {
      type: "array",
      items: {
        type: "number",
      },
    },
    stock: {
      type: "array",
      items: {
        type: "number",
      },
    },
    bookmarked: {
      type: "array",
      items: {
        type: "number",
      },
    },
  },
  required: ["deck", "extraDeck", "stock", "bookmarked"],
  additionalProperties: false,
};

export { IBuildingDeckJSONSchema };
