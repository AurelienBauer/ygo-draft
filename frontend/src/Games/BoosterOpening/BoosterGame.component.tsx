import React, { useContext, useEffect, useState } from "react";
import BoosterGameSelection from "./BoosterGameSelection.component";
import BoosterGameService from "./service/BoosterGameService";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import BoosterGameOpening from "./BoosterGameOpening.component";

type GameStates = "selection" | "opening" | "building";

function BoosterGame() {
  const [state, setState] = useState<GameStates>("selection");
  const [bgservice, setBgservice] = useState<BoosterGameService | null>(null);
  const { socket } = useContext(GameContext) as GameContextType;

  const handleStartOpening = () => {
    setState("opening");
  };

  const handleStartBuilding = () => {
    setState("building");
  };

  useEffect(() => {
    if (socket) {
      setBgservice(new BoosterGameService(socket));
    }
  }, [socket]);

  return (
    <div className="text-center flex justify-content-center">
      {/* <a href="/boosters">Return</a> */}
      {bgservice && state === "selection" && <BoosterGameSelection bgservice={bgservice} handleStartOpening={() => handleStartOpening()} />}
      {bgservice && state === "opening" && <BoosterGameOpening bgservice={bgservice} handleStartBuilding={() => handleStartBuilding()} />}
    </div>
  );
}

export default BoosterGame;
