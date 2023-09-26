import React, {
  Dispatch, FormEvent, useEffect, useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";
import { Socket } from "socket.io-client";
import { useTranslation } from "react-i18next";
import Room from "./Room.component";
import SocketManager from "../../SocketManager";
import RoomManager from "./RoomManager";
import { GameContext, GameContextType } from "../Game/GameContext";
import { Games, IPlayer, IRoom } from "../../types";

interface PropsPlayerConnection {
  handleConnection: (rm: RoomManager) => void;
}

function PlayerConnection(props: PropsPlayerConnection) {
  const { handleConnection } = props;
  const { setSocket, setProfile } = React.useContext(
    GameContext,
  ) as GameContextType;
  const [, setCookie] = useCookies(["socket"]);
  const { t } = useTranslation();

  const [playerName, setPlayerName] = useState("");

  const handleSocketConnection = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const socket = SocketManager.NewSession(playerName);
    const rm = new RoomManager(socket);
    rm.onConnect((s: Socket) => {
      setCookie("socket", s.id, { maxAge: 60 * 60, sameSite: "strict" });
      setSocket(s);
      rm.getMyProfile().then((profile) => {
        setProfile(profile);
        handleConnection(rm);
      });
    });
  };

  return (
    <div>
      <form className="max-width-20" onSubmit={handleSocketConnection}>
        <div className="mb-3">
          <label htmlFor="playerName" className="form-label">
            <b>{t("Choose your username")}</b>
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
          {t("Connect")}
        </button>
      </form>
    </div>
  );
}

interface PropsRoomJoinCreateRoom {
  roomManager: RoomManager | null;
  setIsInRoom: Dispatch<boolean>;
  game: Games;
}

function RoomJoinCreateRoom(props: PropsRoomJoinCreateRoom) {
  const { roomManager, setIsInRoom, game } = props;

  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const { setProfile } = React.useContext(GameContext) as GameContextType;

  const { t } = useTranslation();

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
          forGame: game,
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
            <td>{t("Room")}</td>
            <td>{t("Created by")}</td>
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
                  {t("Join")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="row g-3 max-width-20" onSubmit={createNewRoom}>
        <div>
          <label htmlFor="room_name" className="form-label">
            <b>{t("Create a room")}</b>
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
          {t("Create")}
        </button>
      </form>
    </div>
  );
}

interface Props {
  onGameStart: () => void;
  game: Games;
  skipRoom: boolean;
}

function RoomSelection(props: Props) {
  const { onGameStart, game, skipRoom } = props;

  const { profile, socket, setProfile } = React.useContext(GameContext) as GameContextType;

  const [isConnected, setIsconnected] = useState(false);
  const [roomManager, setRoomManager] = useState<RoomManager | null>(null);
  const [isInRoom, setIsInRoom] = useState<boolean>(false);

  const handleLeftTheRoom = () => {
    setIsInRoom(false);
  };

  const handleConnection = (rm: RoomManager) => {
    setIsconnected(true);
    if (skipRoom && rm) {
      setRoomManager(rm);
      rm
        .createRoom({
          title: uuidv4(),
          forGame: game,
        })
        .then(() => rm.getMyProfile())
        .then((p: IPlayer) => {
          setProfile(p);
          setIsInRoom(true);
          return rm.startGame();
        }).then(() => onGameStart());
    }
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
      {!isConnected && <PlayerConnection handleConnection={handleConnection} />}
      {isConnected && !isInRoom && (
        <RoomJoinCreateRoom
          roomManager={roomManager}
          setIsInRoom={setIsInRoom}
          game={game}
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
