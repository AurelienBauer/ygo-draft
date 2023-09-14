import { saveAs } from "file-saver";
import { IBuildingDeck, ICard } from "./types";

const download = (filename: string, text: string) => {
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(file, filename);
};

const readFileAsync = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    resolve(reader.result as string);
  };
  reader.onerror = reject;
  reader.readAsText(file);
});

const isNumeric = (str: string) => {
  if (typeof str !== "string") return false; // we only process strings!
  return !Number.isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
};

const downloadDeck = (filename: string, deck: ICard[]) => {
  const ids = deck.map((c) => c.id);
  download(`${filename}.ydk`, ids.join("\n"));
};

const downloadDraft = (filename: string, cards: IBuildingDeck) => {
  download(`${filename}.json`, JSON.stringify(cards));
};

const typeSort = [
  {
    name: "Trap Card",
    index: 3,
  },
  {
    name: "Spell Card",
    index: 2,
  },
  {
    name: "Effect Monster",
    index: 1,
  },
  {
    name: "Normal Monster",
    index: 1,
  },
  {
    name: "Flip Effect Monster",
    index: 1,
  },
];

const getCardTypeNumber = (typeName: string): number => {
  const type = typeSort.find((t) => t.name === typeName);
  if (!type) {
    return 0;
  }
  return type.index;
};

export {
  download, readFileAsync, isNumeric, downloadDeck, getCardTypeNumber, downloadDraft,
};
