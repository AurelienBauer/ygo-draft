import axios from "axios";
import { isNumeric, readFileAsync } from "../../../service";
import { ICube } from "./CubeGameService";
import { ICard } from "../../../types";

export default class CubeGameRest {
  public async getCubes(): Promise<ICube[]> {
    const result = await axios.get(`api/v1/cubes`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  }

  public async getCubeById(id: string): Promise<ICube> {
    const result = await axios.get(`api/v1/cubes/${id}?language=fr`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  }

  public async postCubeFromFile(name: string, file: File) {
    let fileContent = await readFileAsync(file);
    const result = await axios.post(
      "api/v1/cubes",
      {
        name,
        description: "small description",
        data: fileContent
          .split(/\r?\n/)
          .filter((line: string) => isNumeric(line)),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result.data;
  }

  public async getCardById(id: string): Promise<ICard> {
    const result = await axios.get(`api/v1/card/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result.data;
  }
}
