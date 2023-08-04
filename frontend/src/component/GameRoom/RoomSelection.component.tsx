import React, {
  Dispatch, FormEvent, useEffect, useState,
} from "react";
import { useCookies } from "react-cookie";
import { Socket } from "socket.io-client";
import Room from "./Room.component";
import SocketManager from "../../SocketManager";
import RoomManager from "./RoomManager";
import { GameContext, GameContextType } from "../Game/GameContext";
import { IPlayer, IRoom } from "../../types";

interface PropsPlayerConnection {
  setIsconnected: Dispatch<boolean>;
}

function PlayerConnection(props: PropsPlayerConnection) {
  const { setIsconnected } = props;
  const { setSocket, setProfile } = React.useContext(
    GameContext,
  ) as GameContextType;
  const [, setCookie] = useCookies(["socket"]);

  const [playerName, setPlayerName] = useState("");

  const handleSocketConnection = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const socket = SocketManager.NewSession(playerName);
    const rm = new RoomManager(socket);
    rm.onConnect((s: Socket) => {
      setIsconnected(true);
      setCookie("socket", s.id, { maxAge: 60 * 60 });
      setSocket(s);
      rm.getMyProfile().then((profile) => {
        setProfile(profile);
      });
    });
  };

  return (
    <div>
      <form className="max-width-20" onSubmit={handleSocketConnection}>
        <div className="mb-3">
          <label htmlFor="playerName" className="form-label">
            <b>Choose your username</b>
            <input
              id="playerName"
              name="player_name"
              className="form-control"
              type="text"
              onChange={(event) => setPlayerName(event.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Connect
        </button>
      </form>
    </div>
  );
}

interface PropsRoomJoinCreateRoom {
  roomManager: RoomManager | null;
  setIsInRoom: Dispatch<boolean>;
}

function RoomJoinCreateRoom(props: PropsRoomJoinCreateRoom) {
  const { roomManager, setIsInRoom } = props;

  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const { setProfile } = React.useContext(GameContext) as GameContextType;

  const updateProfile = () => {
    if (roomManager) {
      roomManager.getMyProfile().then((profile: IPlayer) => {
        setProfile(profile);
      });
    }
  };

  const createNewRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomManager) {
      roomManager
        .createRoom({
          title: roomName,
        })
        .then(() => {
          updateProfile();
          setIsInRoom(true);
        });
    }
  };

  const handleJoinRoom = (roomId: string) => {
    if (roomId && roomManager) {
      roomManager.joinRoom(roomId).then(() => {
        updateProfile();
        setIsInRoom(true);
      });
    }
  };

  useEffect(() => {
    const listRooms = () => {
      roomManager?.getAllRooms(true).then((r) => setRooms(r));
    };

    listRooms();
    const interval = setInterval(listRooms, 5000);
    return () => clearInterval(interval);
  }, [roomManager]);

  return (
    <div>
      <table className="table table-hover table-borderless text-left room-table mt-5">
        <thead>
          <tr>
            <td>NoP</td>
            <td>Room</td>
            <td>Created by</td>
            <td> </td>
          </tr>
        </thead>
        <tbody>
          {rooms?.map((r: IRoom) => (
            <tr key={r.uuid}>
              <td>
                {r.players.length}
                {" "}
                /5
              </td>
              <td>{r.title}</td>
              <td>{r.createdBy}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleJoinRoom(r.uuid)}
                  type="button"
                >
                  Join
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="row g-3 max-width-20" onSubmit={createNewRoom}>
        <div>
          <label htmlFor="room_name" className="form-label">
            <b>Create a room</b>
            <input
              id="room_name"
              className="form-control"
              name="room_name"
              onChange={(event) => {
                setRoomName(event.target.value);
              }}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}

interface Props {
  onGameStart: () => void;
}

function RoomSelection(props: Props) {
  const { onGameStart } = props;

  const { profile, socket } = React.useContext(GameContext) as GameContextType;

  const [isConnected, setIsconnected] = useState(false);
  const [roomManager, setRoomManager] = useState<RoomManager | null>(null);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);

  const handleLeftTheRoom = () => {
    setIsInRoom(false);
  };

  useEffect(() => {
    if (profile && socket && !roomManager) {
      setIsconnected(!!profile);
      setIsInRoom(!!profile?.room);
      setRoomManager(new RoomManager(socket, profile.room?.uuid));
    }
  }, [socket, roomManager, profile]);

  return (
    <div className="container text-center flex justify-content-center">
      {!isConnected && <PlayerConnection setIsconnected={setIsconnected} />}
      {isConnected && !isInRoom && (
        <RoomJoinCreateRoom
          roomManager={roomManager}
          setIsInRoom={setIsInRoom}
        />
      )}
      {isInRoom && (
        <Room
          roomManager={roomManager}
          leftTheRoom={handleLeftTheRoom}
          onGameStart={onGameStart}
        />
      )}
    </div>
  );
}

export default RoomSelection;
