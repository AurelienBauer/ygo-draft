import SocketManager from "../../../SocketManager";
import {
  BoosterOpened, DeckBuilderLoc, IBuildingDeck, Langs,
} from "../../../types";

interface IStartOpening {
  boosterId: string;
  number: number;
}

interface IMoveCardDeckBuilder {
  uuid: string;
  from: DeckBuilderLoc;
  to: DeckBuilderLoc;
}

export default class BoosterGameSocket extends SocketManager {
  public async startOpening(boosters: IStartOpening[]) {
    return this.socketRequest(
      "booster:startopening",
      { boosters },
    ).then((res) => res.data);
  }

  public async open(lang: Langs = "en"): Promise<BoosterOpened> {
    return this.socketRequest<{ lang: Langs }, BoosterOpened>(
      "booster:open",
      { lang },
    ).then((res) => res.data);
  }

  public async moveCard(uuid: string, from: DeckBuilderLoc, to: DeckBuilderLoc): Promise<string> {
    return this.socketRequest<IMoveCardDeckBuilder, string>(
      "booster:movecard",
      { uuid, from, to },
    ).then((res) => res.data);
  }

  public async bookmarkCard(uuid: string): Promise<string> {
    return this.moveCard(uuid, "stock", "bookmarked");
  }

  public async unBookmarkCard(uuid: string): Promise<string> {
    return this.moveCard(uuid, "bookmarked", "stock");
  }

  public async startDeckBuilding(): Promise<string> {
    return this.socketRequest<null, string>(
      "booster:startbuilding",
    ).then((res) => res.data);
  }

  public async deckBuildingCurrentState(): Promise<IBuildingDeck> {
    return this.socketRequest<null, IBuildingDeck>(
      "booster:buildingcurrentstate",
    ).then((res) => res.data);
  }
}
