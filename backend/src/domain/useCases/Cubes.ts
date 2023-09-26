import { v4 as uuidv4 } from "uuid";
import { DataSource, ICube, IDBCube } from "../../data/interfaces";

interface NewCube {
  name: string;
  data: number[];
  author: string;
  description: string;
}

export default class Cubes {
  private ds: DataSource;

  constructor(ds: DataSource) {
    this.ds = ds;
  }

  public getAll = (): Promise<IDBCube[]> => this.ds.cube.getAll();

  public getByID = (id: string, language: string = "en"): Promise<ICube> => this.ds.cube.getByID(id).then((cube: IDBCube) => ({
    id: cube.id,
    name: cube.name,
    description: cube.description,
    cards: cube[`${language}cards`],
    author: cube.author,
    created: cube.created,
  }));

  private retrieveCardsInfo = (cardsID: number[], language?: string) => this.ds.card
    .getByIDs(cardsID, language)
    .then((cards) => cards.sort((a, b) => a.id - b.id));

  public save = async (newCube: NewCube): Promise<string> => {
    const enCards = await this.retrieveCardsInfo(newCube.data);
    const frCards = await this.retrieveCardsInfo(newCube.data, "fr");

    if (enCards.length !== frCards.length) {
      throw new Error(
        "Length of decks for difference languages do not matches",
      );
    }

    for (let i = 0; i < enCards.length; i += 1) {
      const uuid = uuidv4();
      enCards[i].uuid = uuid;
      frCards[i].uuid = uuid;
    }

    const cube = {
      name: newCube.name,
      encards: enCards,
      frcards: frCards,
      author: newCube.author,
      description: newCube.description,
      created: new Date().toISOString(),
    };

    return this.ds.cube.save(cube);
  };
}
