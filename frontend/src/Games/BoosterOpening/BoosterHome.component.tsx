import React from "react";
import Wrapper from "../../component/Wrapper.component";
import Game from "../../component/Game/Game.component";
import BoosterGame from "./BoosterGame.component";

function BoosterHome() {
  return (
    <Wrapper>
      <Game game="booster" skipRoom>
        <BoosterGame />
      </Game>
    </Wrapper>
  );
}

export default BoosterHome;
