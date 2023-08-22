import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { IPlayer } from "../../types";

export type AvailableLangs = "en" | "fr";

export type GameContextType = {
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
  profile: IPlayer | null;
  setProfile: Dispatch<SetStateAction<IPlayer | null>>;
  reconnectionParam: string;
  setReconnectionParam: Dispatch<SetStateAction<string>>;
  lang: AvailableLangs;
  setLang: Dispatch<AvailableLangs>;
};

export const GameContext = React.createContext<GameContextType | null>(null);

interface Props {
  children: ReactNode;
}

function GameProvider(props: Props) {
  const { children } = props;
  const [socket, setSocket] = useState(null);
  const [profile, setProfile] = useState<IPlayer | null>(null);
  const [reconnectionParam, setReconnectionParam] = useState("undefine");
  const [lang, setLang] = useState<AvailableLangs>("en");

  const value = useMemo(
    () => ({
      socket,
      setSocket,
      profile,
      setProfile,
      reconnectionParam,
      setReconnectionParam,
      lang,
      setLang,
    }),
    [socket, profile, reconnectionParam, lang],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameProvider;
