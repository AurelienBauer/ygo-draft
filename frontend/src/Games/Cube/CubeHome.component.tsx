import React from "react";
import "./../../App.css";
import Game from "../../component/Game/Game.component";
import CubeGame from "./CubeGame.component";
import Wrapper from "../../component/Wrapper.component";

const CubeHome = () => {
  return (
    <Wrapper>
      <Game>
        <CubeGame />
      </Game>
    </Wrapper>
  );
};

export default CubeHome;
