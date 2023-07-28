import { Socket } from "socket.io";
import { DataSource } from "../data/interfaces";
import { Callback } from "./event";
import { Player } from "../domain/useCases/Player";
import CubeGame, {
  ExportInGamePlayer,
} from "../domain/useCases/CubeGame";

interface ICubeDraftStart {
  cubeID: string;
}

interface IPlayerPickACard {
  cardUUID: string;
  playerID?: string;
}

interface ICurrentCubeGame {
  cubeID: string;
  board: string[];
  playersInGame: ExportInGamePlayer[];
  currentPlayer: string;
  cardsLeftInDeck: number;
}

export default class CubeGameEventsHandler {
  constructor(private ds: DataSource) {}

  public startDraft(
    socket: Socket,
    playback: ICubeDraftStart,
    callback: Callback<ICubeDraftStart>
  ) {
    const player: Player = socket.data.player;
    if (!player.room) {
      throw new Error("Room is undefined");
    }
    const game = player.room?.game as CubeGame;
    game.init(player.room.getPlayers(), playback.cubeID);
    game.loadCube(playback.cubeID).then(() => {
      socket
        .to(`room:${player.room?.getUUID()}`)
        .emit("cube:draftstarted", playback);
      callback({ data: playback });

      let nbrOfCardToDraw = (player.room?.getPlayers().length || 0) + 1;
      game.drawNCards(
        game.getCardsLeft() > nbrOfCardToDraw
          ? nbrOfCardToDraw
          : game.getCardsLeft()
      );
      const board = game.getBoard();
      socket.data.io.to(`room:${player.room?.getUUID()}`).emit(
        "cube:newboard",
        board.map((b) => b.uuid)
      );
    });
  }

  public pickACard(
    socket: Socket,
    playback: IPlayerPickACard,
    callback: Callback<IPlayerPickACard>
  ) {
    const player: Player = socket.data.player;
    const game = player.room?.game as CubeGame;
    if (!game) {
      throw new Error("Game is undefined");
    }

    const playerID = player.getId();
    const cardUUID = game.playerPickACard(playerID, playback.cardUUID);

    const response = {
      cardUUID: cardUUID,
      playerID: playerID,
    };
    socket
      .to(`room:${player.room?.getUUID()}`)
      .emit("cube:cardpicked", response);
    callback({ data: response });
    if (game.getCardsLeft() <= 0 && game.getBoard().length <= 0) {
      game.changeGameState("draft_over");
      socket.data.io
        .to(`room:${player.room?.getUUID()}`)
        .emit("cube:draft_over");
    } else if (game.getBoard().length <= 1) {
      game.clearBoard();
      let nbrOfCardToDraw = (player.room?.getPlayers().length || 0) + 1;
      game.drawNCards(
        game.getCardsLeft() > nbrOfCardToDraw
          ? nbrOfCardToDraw
          : game.getCardsLeft()
      );
      const board = game.getBoard();
      socket.data.io.to(`room:${player.room?.getUUID()}`).emit(
        "cube:newboard",
        board.map((b) => b.uuid)
      );
      this.nextTurn(socket, game.nextRound());
    } else {
      this.nextTurn(socket, game.nextTurn());
    }
  }

  public currentInfo(socket: Socket, callback: Callback<ICurrentCubeGame>) {
    const player: Player = socket.data.player;
    const game = player.room?.game as CubeGame;
    const currentGame = game.getInfo();
    callback({
      data: {
        cubeID: currentGame.cubeID,
        cardsLeftInDeck: currentGame.cardsLeftInDeck,
        currentPlayer: currentGame.currentPlayer,
        playersInGame: currentGame.playersInGame,
        board: currentGame.board.map((b) => b.uuid ?? ""),
      },
    });
  }

  private nextTurn(socket: Socket, nextPlayerUUID: string) {
    const player: Player = socket.data.player;
    socket.data.io
      .to(`room:${player.room?.getUUID()}`)
      .emit("cube:nextturn", nextPlayerUUID);
  }
}
