import React, { useEffect, useState } from "react";

import RoomManager from "./RoomManager";
import { IRoom } from "../../types";
import RoomModal from "./RoomModal.component";

interface Props {
  roomManager: RoomManager | null;
  leftTheRoom: () => void;
  onGameStart: () => void;
}

function Room(props: Props) {
  const { roomManager, leftTheRoom, onGameStart } = props;

  const [roomInfo, setRoomInfo] = useState<IRoom>();
  const [amIAdmin, setamIAdmin] = useState<boolean>(false);
  const [hasAdminLeft, setHasAdminLeft] = useState<boolean>(false);

  useEffect(() => {
    if (roomManager) {
      roomManager.refresh().then((r: IRoom) => {
        setRoomInfo(r);
      });
    }
  }, [onGameStart, roomManager]);

  useEffect(() => {
    if (roomManager) {
      roomManager.onAdminLeft(() => setHasAdminLeft(true));
      return () => roomManager.onAdminLeftUnsubscribe();
    }
    return () => null;
  }, [roomManager]);

  useEffect(() => {
    if (roomManager) {
      roomManager.onGameStart(() => {
        onGameStart();
      });
      return () => roomManager.onGameStartUnsubscribe();
    }
    return () => null;
  }, [onGameStart, roomManager]);

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
            <span>
              Created by:
              {roomInfo?.createdBy}
            </span>
          </div>
          <div className="mb-4">
            <RoomModal position="centered" />
          </div>
          {amIAdmin && (
            <button className="btn btn-primary mb-3" type="button" onClick={handleStartGame}>
              Start the game
            </button>
          )}
        </div>
      ) : (
        <div> Admin has left, please leave the room</div>
      )}
      <button className="btn btn-secondary" type="button" onClick={handleLeaveTheRoom}>
        Leave the room
      </button>
    </div>
  );
}

export default Room;
