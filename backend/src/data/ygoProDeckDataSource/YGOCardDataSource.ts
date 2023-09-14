import { removeDuplicationFromArray } from "../../service";
import { CardDataSource, ICard } from "../interfaces";
import { YGOCardImages, YGOCardResponseBody, YGORequestResponse } from "./type";

export default class YGOCardDataSource implements CardDataSource {
  private CARDS_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

  // eslint-disable-next-line max-len
  private static findAlternativeIds = (originId: number, images: YGOCardImages[]) :number[] => removeDuplicationFromArray<number>(
    images
      .filter((i) => i.id !== originId)
      .map((i) => i.id),
  );

  public static formatReturnedCard(cards: YGOCardResponseBody[]) {
    return cards.map((card) => ({
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
      altIds: YGOCardDataSource.findAlternativeIds(card.id, card.card_images),
    }));
  }

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
      .then(
        (res: { data: YGOCardResponseBody[] }) => YGOCardDataSource.formatReturnedCard(res.data),
      )
      .catch(() => {
        throw new Error("Card not found");
      });
  }

  public async getByCardset(cardset: string, language?: string): Promise<ICard[]> {
    return fetch(
      `${this.CARDS_URL}?cardset=${cardset}${
        language ? `&language=${language}` : ""
      }`,
    )
      .then((res: YGORequestResponse) => {
        if (res.status !== 200) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(
        (res: { data: YGOCardResponseBody[] }) => YGOCardDataSource.formatReturnedCard(res.data),
      )
      .catch(() => {
        throw new Error(`Cards not found for cardset ${cardset}`);
      });
  }
}
