import React, { useState } from "react";
import { ConnectionDot } from "../frontendComponent/connectionDot/Dots.component";
import Icon from "../frontendComponent/Icon.components";
import YesNoModal from "./YesNoModal.component";
import { Socket } from "socket.io-client";
import SocketManager from "../SocketManager";
import { GameContext, GameContextType } from "./Game/GameContext";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

interface Props {
  name: string;
  socket: Socket;
}

const ConnectedBadge = ({ name }: Props) => {
  const [open, setOpen] = useState(false);
  const [_, __, removeCookie] = useCookies(["socket"]);
  const navigate = useNavigate();

  const { socket, setSocket, setProfile, setReconnectionParam } =
    React.useContext(GameContext) as GameContextType;

  const handleLeave = () => {
    if (socket) {
      const socketManager = new SocketManager(socket);
      socketManager.disconnect().then(() => {
        setOpen(false);
        setSocket(null);
        setProfile(null);
        removeCookie("socket");
        setReconnectionParam("undefine");
        navigate("/");
      });
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <div className="connected-badge">
      <ConnectionDot />
      <div className="connected-player-name">{name}</div>
      <div className="leave-room-icon" onClick={handleOpenModal}>
        <Icon icon="signout" scale="0.7" />
      </div>
      <YesNoModal
        open={open}
        handleYesResponse={handleLeave}
        handleNoResponse={handleCloseModal}
        text="Are you sure you want to disconnect?"
      />
    </div>
  );
};

export default ConnectedBadge;
