import axios from "axios";
import { IBooster } from "../../../types";

export default class BoosterGameRest {
  public static async getBoosters(): Promise<IBooster[]> {
    const result = await axios.get("api/v1/booster", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  }
}
