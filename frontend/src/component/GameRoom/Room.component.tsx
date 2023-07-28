import React from "react";
import { useEffect, useState } from "react";
import RoomManager from "./RoomManager";
import { IRoom } from "../../types";
import RoomModal from "./RoomModal.component";

interface Props {
  roomManager: RoomManager | null;
  leftTheRoom: () => void;
  onGameStart: () => void;
}

const Room = (props: Props) => {
  const { roomManager, leftTheRoom, onGameStart } = props;

  const [roomInfo, setRoomInfo] = useState<IRoom>();
  const [amIAdmin, setamIAdmin] = useState<boolean>(false);
  const [hasAdminLeft, setHasAdminLeft] = useState<boolean>(false);

  useEffect(() => {
    roomManager?.refresh().then((r: IRoom) => {
      setRoomInfo(r);
    });

    if (roomManager) {
      roomManager.onAdminLeft(() => setHasAdminLeft(true));

      roomManager.onGameStart(() => {
        onGameStart();
      });
    }
    return;
  }, [roomManager]);

  useEffect(() => {
    if (roomManager && roomInfo) {
      roomManager
        .amIAdmin(roomInfo.adminId.pub)
        .then((isAdmin: boolean) => setamIAdmin(isAdmin));
    }
  }, [roomInfo, roomManager]);

  const handleLeaveTheRoom = () => {
    if (roomManager) {
      roomManager.leaveRoom().then(() => {
        leftTheRoom();
      });
    }
  };

  const handleStartGame = () => {
    if (roomManager) {
      roomManager.startGame().then(() => {
        onGameStart();
      });
    }
  };

  return (
    <div>
      {!hasAdminLeft ? (
        <div className="width-20 mt-5">
          <div className="flex space-between mb-1">
            <div>{roomInfo?.title}</div>
            <span>Created by: {roomInfo?.createdBy}</span>
          </div>
          <div className="mb-4">
            <RoomModal position="centered" />
          </div>
          <RoomModal position="fixed" />
          {amIAdmin && (
            <button className="btn btn-primary mb-3" onClick={handleStartGame}>
              Start the game
            </button>
          )}
        </div>
      ) : (
        <div> Admin has left, please leave the room</div>
      )}
      <button className="btn btn-secondary" onClick={handleLeaveTheRoom}>
        Leave the room
      </button>
    </div>
  );
};

export default Room;
