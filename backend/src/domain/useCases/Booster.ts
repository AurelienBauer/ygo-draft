import { DataSource, IBooster, ICard } from "../../data/interfaces";
import { verifyEndpoint } from "../../service";

interface FetchBoosterResult {
  id: string;
  name: string;
  error?: string;
}

export default class Booster {
  private ds: DataSource;

  constructor(ds: DataSource) {
    this.ds = ds;
  }

  public fetchBooster = async (): Promise<FetchBoosterResult[]> => Promise.all(
    this.ds.pack.fetchPacks().map(async (pack) => {
      try {
        const encodedAlias = encodeURIComponent(pack.alias);
        const enCards = await this.ds.card.getByCardset(encodedAlias);
        const frCards = await this.ds.card.getByCardset(encodedAlias, "fr");

        if (enCards.length !== frCards.length) {
          throw new Error(
            "Length of decks for difference languages do not matches",
          );
        }

        const packOpenerLink = pack.pack_opener_link
            ?? `https://ygoprodeck.com/api/pack-sim/pack-open.php?format=${encodedAlias}&settype=${pack.code}`;
        if (!await verifyEndpoint(packOpenerLink)) {
          return ({
            id: "undefine",
            name: pack.name,
            error: `Pack opener link: ${packOpenerLink} is not valid`,
          });
        }

        const id = await this.ds.booster.save({
          name: pack.name,
          name_fr: pack.name_fr,
          alias: pack.alias,
          region: pack.region,
          release_date: new Date(pack.release_date),
          image_url: `https://images.ygoprodeck.com/images/sets/${pack.img_code}.jpg`,
          encards: enCards,
          frcards: frCards,
          pack_opener_link: packOpenerLink,
        });

        return {
          id,
          name: pack.name,
        };
      } catch (err) {
        return {
          id: "undefine",
          name: pack.name,
          error: (err as Error).message,
        };
      }
    }),
  );

  public getAll = (): Promise<IBooster[]> => this.ds.booster
    .getAll()
    .then((res) => res.map((booster) => ({
      // eslint-disable-next-line no-underscore-dangle
      id: booster._id ?? "",
      name: booster.name,
      name_fr: booster.name_fr,
      image_url: booster.image_url,
      release_date: booster.release_date,
      region: booster.region,
      alias: booster.alias,
      pack_opener_link: booster.pack_opener_link,
    })));

  public getCards = async (id: string, language: string): Promise<ICard[]> => {
    const booster = await this.ds.booster.getByID(id);
    if (language === "fr") {
      return booster.frcards;
    }
    return booster.encards;
  };
}
