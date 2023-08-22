import SocketManager from "../../../SocketManager";
import { BoosterOpened, Langs } from "../../../types";

interface IStartOpening {
  boosterId: string;
  number: number;
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
}
