import { IPackCard, Pack, PackDataSource } from "../interfaces";
import { YGORequestResponse } from "./type";
import packs from "./packs.json";

export default class YGOPackDataSource implements PackDataSource {
  // eslint-disable-next-line class-methods-use-this
  public async openPack(url: string): Promise<IPackCard[]> {
    return fetch(url)
      .then((res: YGORequestResponse) => {
        if (res.status !== 200) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json().then((c: Array<IPackCard[]>) => c[0]);
      })
      .then()
      .catch(() => {
        throw new Error("Card not found");
      });
  }

  // eslint-disable-next-line class-methods-use-this
  public fetchPacks(): Pack[] {
    return packs;
  }
}
