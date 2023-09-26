import Ajv, { JSONSchemaType } from "ajv";
import { saveAs } from "file-saver";
import { DeckBuilderFilter, IBuildingDeckExport, ICard } from "./types";

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

const downloadDraft = (filename: string, cards: IBuildingDeckExport) => {
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

const cardTypes = [
  {
    name: "Normal Monster",
  },
  {
    name: "Effect Monster",
  },
  {
    name: "Flip Effect Monster",
  },
  {
    name: "Fusion Monster",
  },
  {
    name: "Ritual Effect Monster",
  },
  {
    name: "Trap Card",
  },
  {
    name: "Spell Card",
  },
];

const cardLevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "?"];

const getCardTypeNumber = (typeName: string): number => {
  const type = typeSort.find((t) => t.name === typeName);
  if (!type) {
    return 0;
  }
  return type.index;
};

const filterCards = (deck: ICard[], filters: DeckBuilderFilter): ICard[] => deck
  // eslint-disable-next-line no-underscore-dangle
  .filter((c) => filters.type === "" || c._type === filters.type)
  .filter((c) => filters.level === "" || (c.level && c.level.toString() === filters.level))
  .filter((c) => filters.search === "" || c.name.toLowerCase().indexOf(filters.search.toLowerCase()) >= 0);

const orderCards = (deck: ICard[]): ICard[] => deck.slice(0)
  .sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  })
  .sort(
    // eslint-disable-next-line no-underscore-dangle
    (a, b) => getCardTypeNumber(a._type) - getCardTypeNumber(b._type),
  )
  .sort((a, b) => a.level - b.level);

export function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    // Read the file as text
    fileReader.readAsText(file, "UTF-8");

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      if (e?.target?.result) {
        resolve(e?.target?.result as string);
      } else {
        reject(new Error("Failed to read the file."));
      }
    };

    // Set up onerror callback
    fileReader.onerror = () => {
      reject(new Error("An error occurred while reading the file."));
    };
  });
}

export function validateJSONWithJSONSchema<T>(json: unknown, jsonSchema: JSONSchemaType<T>) {
  const ajv = new Ajv();
  const validate = ajv.compile(jsonSchema);
  return validate(json);
}

export {
  download,
  readFileAsync,
  isNumeric,
  downloadDeck,
  getCardTypeNumber,
  downloadDraft,
  cardTypes,
  cardLevels,
  orderCards,
  filterCards,
};
