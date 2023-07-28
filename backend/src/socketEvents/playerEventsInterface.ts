import { IPlayer } from "../domain/useCases/Player";
import { Callback } from "./event";

export interface ICreatePlayer {
  name: string;
}

export interface IPlayerClientEvents {
  "player:create": (
    playback: ICreatePlayer,
    callback: Callback<IPlayer>
  ) => void;

  "me:profile": (playback: ICreatePlayer, callback: Callback<IPlayer>) => void;
}
