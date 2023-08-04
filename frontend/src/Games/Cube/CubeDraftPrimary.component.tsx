import React, { useCallback, useEffect, useState } from "react";
import { ICard, ICube, IPlayer } from "../../types";
import CubeGameService from "./service/CubeGameService";
import { GameContext, GameContextType } from "../../component/Game/GameContext";

interface Props {
  cgservice: CubeGameService;
  cube: ICube | undefined;
  addCardToPlayerDeck: (currentPlayer: string, card: ICard) => void;
  handleOpenDetailModal: (c: ICard) => void;
}

function CubeDraftPrimary(props: Props) {
  const {
    cube, cgservice, addCardToPlayerDeck, handleOpenDetailModal,
  } = props;
  const [boardCards, setBoardCards] = useState<ICard[]>([]);
  const [displayBoard, setDisplayBoard] = useState<ICard[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [players, setPlayers] = useState<IPlayer[]>([]);

  const { profile } = React.useContext(GameContext) as GameContextType;

  const removeCardFromBoard = useCallback((cardUUID: string) => {
    setBoardCards(boardCards.filter((c) => c.uuid !== cardUUID));
  }, [boardCards]);

  const handleCardPicked = (card: ICard) => {
    cgservice.socket.pickACard(card.uuid, true).then((res) => {
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
    return () => cgservice.socket.onCardPickedUnsubscribe();
  }, [boardCards, addCardToPlayerDeck, cgservice.socket, removeCardFromBoard]);

  useEffect(() => {
    if (cube) {
      cgservice.socket.getCurrentGameState().then((gamecube) => {
        setPlayers(gamecube.playersInGame.map((pig) => pig.player));
        const board = cube.cards.filter((c) => gamecube.board.includes(c.uuid));
        if (board) {
          setDisplayBoard(board);
          setBoardCards(board);
        }
        setCurrentPlayer(gamecube.currentPlayer);
      });
    }
  }, [cgservice.socket, cube]);

  useEffect(() => {
    if (cube) {
      cgservice.socket.onNewBoard((cards) => {
        const board = cube.cards.filter((c) => cards.includes(c.uuid));
        if (board) {
          setDisplayBoard(board);
          setBoardCards(board);
        }
      });
      return () => cgservice.socket.onNewBoardUnsubscribe();
    }
    return () => null;
  }, [cgservice.socket, cube]);

  useEffect(() => {
    cgservice.socket.onNextTurn((playerUUID: string) => {
      setCurrentPlayer(playerUUID);
    });
    return () => cgservice.socket.onNextTurnUnsubscribe();
  }, [cgservice.socket]);

  const getTurn = (): string => {
    const player = players.filter((p) => p.uuid === currentPlayer);
    if (player.length <= 0 || !profile?.uuid) {
      return "UNKNOWN";
    }

    return player[0].uuid === profile.uuid
      ? "YOUR TURN"
      : `${player[0].name.toUpperCase()} IS PLAYING`;
  };

  return (
    <div className="section">
      <div className="pick-grid mt-5 mb-5">
        {displayBoard.map((card: ICard) => (card?.image_url ? (
          <div
            key={card.uuid}
            className={!boardCards.includes(card) ? "hidden" : ""}
          >
            <div onClick={() => handleCardPicked(card)} onKeyDown={() => handleCardPicked(card)} role="button" tabIndex={0}>
              <img
                className="pick-picture"
                src={card.image_url}
                alt={card.name}
              />
            </div>
            <br />
            <button
              onClick={() => handleOpenDetailModal(card)}
              className="mt-2 btn btn-outline-secondary"
              type="button"
            >
              Detail
            </button>
          </div>
        ) : (
          <div key={card.uuid} />
        )))}
      </div>
      <h2 className="big-yellow-text">{getTurn()}</h2>
    </div>
  );
}

export default CubeDraftPrimary;
