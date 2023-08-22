import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { GameContext, GameContextType } from "./Game/GameContext";
import SocketManager from "../SocketManager";
import YesNoModal from "./YesNoModal.component";

function Reconnection() {
  const [cookie, setCookie, removeCookie] = useCookies(["socket"]);
  const {
    socket, setSocket, setProfile, setReconnectionParam,
  } = useContext(GameContext) as GameContextType;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [canReconnect, setCanReconnect] = useState(false);
  const [socketManager, setSocketManager] = useState<
  SocketManager | undefined
  >();

  const handleJoinPreviousSession = (e: Event) => {
    e.preventDefault();

    if (socketManager && cookie.socket) {
      socketManager
        .reconnect(cookie.socket)
        .then(({ game, gameCurrentState }) => {
          socketManager.getMyProfile().then((profile) => {
            setCookie("socket", profile.socketID, { maxAge: 60 * 60, sameSite: "strict" });
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
      socketManager.abordReconnect(cookie.socket).then(() => {
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
    if (cookie.socket && !socket) {
      const skt = SocketManager.ReconnectSession(cookie.socket);
      const sm = new SocketManager(skt);
      sm.onConnect(() => {
        setSocket(skt);
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
      return () => sm.unsubscribeToAllListeners();
    }
    return () => null;
  }, [cookie.socket, navigate, removeCookie, setProfile, setReconnectionParam, setSocket, socket]);

  return (
    <YesNoModal
      open={canReconnect}
      handleNoResponse={handleAbortPreviousSession}
      handleYesResponse={handleJoinPreviousSession}
      text={t("Re-connect to your previous session?")}
    />
  );
}

export default Reconnection;
