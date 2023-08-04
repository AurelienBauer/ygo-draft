import { CardDataSource, ICard } from "../interfaces";

interface YGORequestResponse {
  status: number;
  statusText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
}

interface YGOCardImages {
  image_url: string;
  image_url_small: string;
}

interface YGOCardResponseBody {
  id: number;
  name: string;
  desc: string;
  card_images?: YGOCardImages[];
  type?: string;
  attribute?: string;
  level?: number;
  frameType: string;
  atk?: number;
  def?: number;
  race?: string;
  archetype?: string;
}

export default class YGOCardDataSource implements CardDataSource {
  private CARDS_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

  private static findFirstImageSrcInImages(
    images: YGOCardImages[] | undefined,
    key: string,
  ): string {
    return images?.[0]?.[key] ? images[0][key] : "";
  }

  public async getByIDs(ids: string[], language?: string): Promise<ICard[]> {
    return fetch(
      `${this.CARDS_URL}?id=${ids.join(",")}${
        language ? `&language=${language}` : ""
      }`,
    )
      .then((res: YGORequestResponse) => {
        if (res.status !== 200) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((res: { data: YGOCardResponseBody[] }) => res.data.map((card) => ({
        id: card.id,
        name: card.name,
        description: card.desc,
        image_url: YGOCardDataSource.findFirstImageSrcInImages(
          card.card_images,
          "image_url",
        ),
        image_small_url: YGOCardDataSource.findFirstImageSrcInImages(
          card.card_images,
          "image_url_small",
        ),
        _type: card.type,
        attribute: card.attribute,
        level: card.level,
        frameType: card.frameType,
        atk: card.atk,
        def: card.def,
        race: card.race,
        archetype: card.archetype,
      })))
      .catch(() => {
        throw new Error("Card not found");
      });
  }
}
