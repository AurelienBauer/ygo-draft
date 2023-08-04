import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  ConnectionDot,
  DisconnectionDot,
} from "../../frontendComponent/connectionDot/Dots.component";
import Icon from "../../frontendComponent/Icon.components";
import { GameContext, GameContextType } from "../Game/GameContext";
import RoomManager from "./RoomManager";
import { IRoom } from "../../types";

interface Props {
  position: "centered" | "fixed";
}

function RoomModal(props: Props) {
  const { position } = props;
  const { profile, socket } = React.useContext(GameContext) as GameContextType;

  const [isOpen, setIsOpen] = useState(true);
  const [room, setRoom] = useState<IRoom | undefined>();

  const handleOpenCloseModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (socket && profile?.room?.uuid) {
      const roomManager = new RoomManager(socket, profile.room.uuid);

      const refreshModal = () => {
        roomManager.refresh().then((r: IRoom) => {
          setRoom(r);
        });
      };

      // Event listeners
      const onPlayerEvent = () => {
        refreshModal();
      };

      roomManager.onPlayerDisconnect(onPlayerEvent);
      roomManager.onPlayerReconnect(onPlayerEvent);
      roomManager.onPlayerLeft(onPlayerEvent);
      roomManager.onPlayerJoin(onPlayerEvent);

      refreshModal();

      return () => roomManager.unsubscribeToAllListeners();
    }
    return () => null;
  }, [socket, profile]);

  return (
    <div
      className={`room-side-modal ${position} ${
        isOpen ? "modal-open" : "modal-close"
      }`}
    >
      {position === "fixed" && (
        <div
          className="room-side-button"
          onClick={handleOpenCloseModal}
          onKeyDown={handleOpenCloseModal}
          role="button"
          tabIndex={0}
        >
          <Icon
            icon={isOpen ? "arrow-right" : "arrow-left"}
            scale="0.7"
            strokeWidth="3"
          />
        </div>
      )}
      <div>
        Room:
        {room?.title}
      </div>
      <div className="room-list-of-players">
        {room?.players.map((p) => (
          <div key={`player-in-room-${p.uuid}`}>
            {p.connected ? <ConnectionDot /> : <DisconnectionDot />}
            <div className="player-name">{p.name}</div>
            {p.uuid === room.adminId.pub && (
              <>
                <div
                  className="player-admin-icon"
                  data-tooltip-id="tt-icon-admin"
                  data-tooltip-content="Admin of the room"
                >
                  <Icon
                    icon="user-filled"
                    scale="0.7"
                    strokeWidth="2"
                    strokeColor="#D00"
                  />
                </div>
                <Tooltip id="tt-icon-admin" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomModal;
