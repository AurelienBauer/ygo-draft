import React, { ReactNode } from "react";
import Reconnection from "./Reconnection.component";
import { GameContext, GameContextType } from "./Game/GameContext";
import ConnectedBadge from "./ConnectionDot.component";

interface Props {
  children: ReactNode;
}

function Wrapper(props: Props) {
  const { children } = props;

  const { profile, socket } = React.useContext(GameContext) as GameContextType;

  return (
    <div className="App">
      <Reconnection />
      {children}
      {socket?.connected && profile?.name && (
        <ConnectedBadge name={profile.name} />
      )}
    </div>
  );
}

export default Wrapper;
