/* eslint-disable no-underscore-dangle */
import { JSONSchemaType } from "ajv";
import {
  DeckBuilderLoc, IBooster, IBuildingDeckExport, ICard, SelectedBooster,
} from "../../types";

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

export function sortAndMapBoostersSelection(boosters: IBooster[], lang = "en") {
  return boosters
    .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
    .map((b) => ({
      boosterId: b.id,
      boosterName: (lang === "fr" && b.name_fr) ? b.name_fr : b.name,
      imageUrl: b.image_url,
      number: 0,
    }));
}

export function sortAndMapBoostersOpeningList(boosters: IBooster[], lang = "en") {
  return boosters
    .map((b) => ({
      boosterId: b.id,
      boosterName: (lang === "fr" && b.name_fr) ? b.name_fr : b.name,
      imageUrl: b.image_url,
      number: 1,
    })).reduce((result: (SelectedBooster[]), entry: SelectedBooster) => {
      const incrementNumberForIndex = (arr: SelectedBooster[], index: number) => arr
        .map((item, i) => {
          if (i === index) {
            return {
              ...item,
              number: item.number + 1,
            };
          }
          return item;
        });

      const index = result.findIndex((e: SelectedBooster) => e.boosterName === entry.boosterName);
      if (index >= 0) {
        return incrementNumberForIndex(result, index);
      }
      result.push(entry);
      return result;
    }, []).reverse();
}

export const IBuildingDeckJSONSchema: JSONSchemaType<IBuildingDeckExport> = {
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
