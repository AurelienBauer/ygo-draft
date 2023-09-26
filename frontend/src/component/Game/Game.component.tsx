import React, { ReactNode, useEffect, useState } from "react";
import GameRoomSelection from "../GameRoom/RoomSelection.component";
import { GameContext, GameContextType } from "./GameContext";
import { Games } from "../../types";

interface Props {
  children: ReactNode;
  game: Games;
  skipRoom?: boolean;
}

function Game(props: Props) {
  const { children, game, skipRoom } = props;

  const { reconnectionParam } = React.useContext(
    GameContext,
  ) as GameContextType;

  const [hasStarted, setHasStarted] = useState(false);

  const handleGameStart = () => {
    setHasStarted(true);
  };

  useEffect(() => {
    if (
      reconnectionParam !== "undefine"
      && reconnectionParam !== "not_in_game"
      && reconnectionParam !== "room"
    ) {
      setHasStarted(true);
    }
  }, [reconnectionParam]);

  return (
    <div className="container section">
      {hasStarted ? (
        children
      ) : (
        <GameRoomSelection onGameStart={handleGameStart} game={game} skipRoom={!!skipRoom} />
      )}
    </div>
  );
}

Game.defaultProps = {
  skipRoom: false,
};

export default Game;
