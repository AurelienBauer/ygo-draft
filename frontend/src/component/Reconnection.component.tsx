import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { GameContext, GameContextType } from "./Game/GameContext";
import SocketManager from "../SocketManager";
import { useNavigate } from "react-router";
import YesNoModal from "./YesNoModal.component";

const Reconnection = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["socket"]);
  const { socket, setSocket, setProfile, setReconnectionParam } =
    React.useContext(GameContext) as GameContextType;
  const navigate = useNavigate();

  const [canReconnect, setCanReconnect] = useState(false);
  const [socketManager, setSocketManager] = useState<
    SocketManager | undefined
  >();

  const isASessionAlreadyExist = () => cookie.socket && !socket;

  const handleJoinPreviousSession = (e: Event) => {
    e.preventDefault();

    if (socketManager && cookie.socket) {
      socketManager
        .reconnect(cookie.socket)
        .then(({ game, gameCurrentState }) => {
          socketManager.getMyProfile().then((profile) => {
            setCookie("socket", profile.socketID, { maxAge: 60 * 60 });
            setProfile(profile);
            setCanReconnect(false);
            if (game && gameCurrentState) {
              setReconnectionParam(gameCurrentState);
              navigate(`/${game}`);
            } else {
              setReconnectionParam("not_in_game");
              navigate("/");
            }
          });
        });
    }
  };

  const handleAbortPreviousSession = () => {
    if (socketManager && cookie.socket) {
      socketManager.abordReconnect(cookie.socket).then((data) => {
        setSocket(null);
        setProfile(null);
        setCanReconnect(false);
        removeCookie("socket");
        setReconnectionParam("undefine");
        navigate("/");
      });
    }
  };

  useEffect(() => {
    if (isASessionAlreadyExist()) {
      const socket = SocketManager.ReconnectSession(cookie.socket);
      const sm = new SocketManager(socket);
      sm.onConnect(() => {
        setSocket(socket);
        setSocketManager(sm);
        setCanReconnect(true);
      });
      sm.onDisconnect(() => {
        setSocket(null);
        setProfile(null);
        setCanReconnect(false);
        removeCookie("socket");
        setReconnectionParam("undefine");
        navigate("/");
      });
    }
  }, [cookie.socket, socket]);

  return (
    <YesNoModal
      open={canReconnect}
      handleNoResponse={handleAbortPreviousSession}
      handleYesResponse={handleJoinPreviousSession}
      text="Re-connect to your previous session?"
    />
  );
};

export default Reconnection;
