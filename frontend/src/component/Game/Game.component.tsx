import React, { ReactNode, useEffect, useState } from "react";
import GameRoomSelection from "../GameRoom/RoomSelection.component";
import { GameContext, GameContextType } from "./GameContext";

interface Props {
  children: ReactNode;
}

function Game(props: Props) {
  const { children } = props;

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
        <GameRoomSelection onGameStart={handleGameStart} />
      )}
    </div>
  );
}

export default Game;
