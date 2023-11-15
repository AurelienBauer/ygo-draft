import Ajv, { JSONSchemaType } from "ajv";
import { saveAs } from "file-saver";
import {
  DeckBuilderFilter, IBuildingDeckExport, ICard, ICardGroup,
} from "./types";

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

const cardAttributes = [
  {
    name: "EARTH",
  },
  {
    name: "DARK",
  },
  {
    name: "FIRE",
  },
  {
    name: "WATER",
  },
  {
    name: "WIND",
  },
  {
    name: "LIGHT",
  },
];

const cardLevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "?"];

const cardRaces = [
  "Pyro", "Beast", "Zombie", "Dinosaur", "Aqua", "Warrior", "Machine",
  "Plant", "Fish", "Insect", "Fairy", "Thunder", "Fiend", "Dragon", "Reptile",
  "Spellcaster", "Winged Beast", "Beast-Warrior", "Sea Serpent",
];

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
  .filter((c) => filters.race === "" || c.race === filters.race)
  .filter((c) => filters.attribute === "" || c.attribute === filters.attribute)
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

const groupCards = (deck: ICard[]): ICardGroup[] => deck.reduce((result, entry) => {
  const incrementNumberForIndex = (arr: ICardGroup[], index: number) => arr
    .map((item, i) => {
      if (i === index) {
        return {
          ...item,
          number: item.number + 1,
        };
      }
      return item;
    });

  const index = result.findIndex((e: ICardGroup) => e.id === entry.id);
  if (index >= 0) {
    return incrementNumberForIndex(result, index);
  }

  const testObj = {
    ...entry,
    number: 1,
  };
  // result.push(testObj);
  return [...result, testObj];
}, []);

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
  cardAttributes,
  cardRaces,
  orderCards,
  filterCards,
  groupCards,
};
