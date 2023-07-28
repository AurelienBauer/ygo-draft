import React, { ReactNode } from "react";
import Reconnection from "./Reconnection.component";
import { GameContext, GameContextType } from "./Game/GameContext";
import ConnectedBadge from "./ConnectionDot.component";

interface Props {
  children: ReactNode;
}

const Wrapper = (props: Props) => {
  const { children } = props;

  const { profile, socket } = React.useContext(GameContext) as GameContextType;

  return (
    <div className="App">
      <Reconnection />
      {children}
      {socket?.connected && profile?.name && (
        <ConnectedBadge name={profile.name} socket={socket} />
      )}
    </div>
  );
};

export default Wrapper;
