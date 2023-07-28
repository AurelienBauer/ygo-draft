import { ICard } from "./types";

const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
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
