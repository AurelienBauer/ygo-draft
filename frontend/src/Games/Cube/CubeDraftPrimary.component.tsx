import React, { useEffect, useState } from "react";
import { ICard, IPlayer } from "../../types";
import CubeGameService, { ICube } from "./service/CubeGameService";
import { GameContext, GameContextType } from "../../component/Game/GameContext";

interface Props {
  cgservice: CubeGameService;
  cube?: ICube;
  addCardToPlayerDeck: (currentPlayer: string, card: ICard) => void;
  handleOpenDetailModal: (c: ICard) => void;
}

const CubeDraftPrimary = (props: Props) => {
  const { cube, cgservice, addCardToPlayerDeck, handleOpenDetailModal } = props;
  const [boardCards, setBoardCards] = useState<ICard[]>([]);
  const [displayBoard, setDisplayBoard] = useState<ICard[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [players, setPlayers] = useState<IPlayer[]>([]);

  const { profile } = React.useContext(GameContext) as GameContextType;

  const removeCardFromBoard = (cardUUID: string) => {
    setBoardCards(boardCards.filter((c) => c.uuid !== cardUUID));
  };

  const handleCardPicked = (card: ICard) => {
    cgservice.socket.pickACard(card.uuid).then((res) => {
      removeCardFromBoard(res.cardUUID);
      addCardToPlayerDeck(currentPlayer, card);
    });
  };

  useEffect(() => {
    cgservice.socket.onCardPicked((res) => {
      removeCardFromBoard(res.cardUUID);
      const card = boardCards.find((c) => c.uuid === res.cardUUID);
      if (card && res.playerID) {
        addCardToPlayerDeck(res.playerID, card);
      }
    });
  }, [boardCards]);

  useEffect(() => {
    cgservice.socket.onNewBoard((cards) => {
      const board = cube?.cards.filter((c) => cards.includes(c.uuid));
      if (board) {
        setDisplayBoard(board);
        setBoardCards(board);
      }
    });

    cgservice.socket.onNextTurn((playerUUID: string) => {
      setCurrentPlayer(playerUUID);
    });

    cgservice.socket.getCurrentGameState().then((gamecube) => {
      setPlayers(gamecube.playersInGame.map((pig) => pig.player));
      const board = cube?.cards.filter((c) => gamecube.board.includes(c.uuid));
      if (board) {
        setDisplayBoard(board);
        setBoardCards(board);
      }
      setCurrentPlayer(gamecube.currentPlayer);
    });
  }, [cube]);

  const getTurn = (): string => {
    const p = players.filter((p) => p.uuid === currentPlayer);
    if (p.length <= 0 || !profile?.uuid) {
      return "UNKNOWN";
    }

    return p[0].uuid === profile.uuid
      ? "YOUR TURN"
      : `${p[0].name.toUpperCase()} IS PLAYING`;
  };

  return (
    <div className="section">
      <div className="pick-grid mt-5 mb-5">
        {displayBoard.map((card: ICard) =>
          card?.image_url ? (
            <div
              key={card.uuid}
              className={!boardCards.includes(card) ? "hidden" : ""}
            >
              <img
                className="pick-picture"
                src={card.image_url}
                onClick={() => handleCardPicked(card)}
                alt={card.name}
              />
              <br />
              <button
                onClick={() => handleOpenDetailModal(card)}
                className="mt-2 btn btn-outline-secondary"
              >
                Detail
              </button>
            </div>
          ) : (
            <div key={card.uuid} />
          )
        )}
      </div>
      <h2 className="big-yellow-text">{getTurn()}</h2>
    </div>
  );
};

export default CubeDraftPrimary;
