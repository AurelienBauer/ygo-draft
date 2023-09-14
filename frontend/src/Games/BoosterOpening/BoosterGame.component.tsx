import React, { useContext, useEffect, useState } from "react";
import BoosterGameSelection from "./BoosterGameSelection.component";
import BoosterGameService from "./service/BoosterGameService";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import BoosterGameOpening from "./BoosterGameOpening.component";
import BoosterGameBuilding from "./BoosterGameBuilding.component";

type GameStates = "game_start" | "start_opening" | "start_building";

function BoosterGame() {
  const [bgservice, setBgservice] = useState<BoosterGameService | null>(null);
  const { socket, reconnectionParam } = useContext(GameContext) as GameContextType;
  const [state, setState] = useState<GameStates>(
    reconnectionParam === "undefine" ? "game_start" : reconnectionParam as GameStates,
  );

  const handleStartOpening = () => {
    setState("start_opening");
  };

  const handleStartBuilding = () => {
    if (bgservice) {
      bgservice.socket.startDeckBuilding().then(() => {
        setState("start_building");
      });
    }
  };

  useEffect(() => {
    if (socket) {
      setBgservice(new BoosterGameService(socket));
    }
  }, [socket]);

  return (
    <div className="text-center flex justify-content-center">
      {bgservice && state === "game_start" && <BoosterGameSelection bgservice={bgservice} handleStartOpening={() => handleStartOpening()} />}
      {bgservice && state === "start_opening" && <BoosterGameOpening bgservice={bgservice} handleStartBuilding={() => handleStartBuilding()} />}
      {bgservice && state === "start_building" && <BoosterGameBuilding bgservice={bgservice} />}
    </div>
  );
}

export default BoosterGame;
