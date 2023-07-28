import { ICard } from "./types";
import { saveAs } from "file-saver";

const download = (filename: string, text: string) => {
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(file, filename);
};

const readFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const isNumeric = (str: string) => {
  if (typeof str !== "string") return false; // we only process strings!
  return !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
};

const downloadDeck = (filename: string, deck: ICard[]) => {
  const ids = deck.map((c) => c.id);
  download(`${filename}.ydk`, ids.join("\n"));
};

export { download, readFileAsync, isNumeric, downloadDeck };
