import { DataSource, ICard } from "../../data/interfaces";

export default class Card {
  private ds: DataSource;

  constructor(ds: DataSource) {
    this.ds = ds;
  }

  public getByID = async (id: string): Promise<ICard> => {
    const res = await this.ds.card.getByIDs([id]);
    return res[0];
  };
}
