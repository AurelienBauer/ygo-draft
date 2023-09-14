import { DeckBuilderLoc, ICard } from "../../types";

function isAnExtraDeckCard(c: ICard) {
  // eslint-disable-next-line no-underscore-dangle
  return c._type === "Fusion Monster";
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
