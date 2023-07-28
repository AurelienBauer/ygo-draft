import React, { useEffect, useState } from "react";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import CubeGameService from "./service/CubeGameService";
import CubeSelection from "./CubeSelection.component";
import { ICubeDraftStart } from "./service/CubeGameSocket";
import CubeDraft from "./CubeDraft.component";
import { useNavigate } from "react-router-dom";
import RoomModal from "../../component/GameRoom/RoomModal.component";
import { ICard } from "../../types";
import CardDetail from "../../component/CardDetail.component";

interface PropsGAModal {
  open: boolean;
  handleLeaveGameRoom: () => void;
}

const GameAbordedModal = (props: PropsGAModal) => {
  const { open, handleLeaveGameRoom } = props;

  return (
    <div className={`modal small ${open ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-body">
          <div className="text-align-start">
            <h5>Game aborded</h5>
            <p>A player has left the room, the game cannot continue.</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleLeaveGameRoom}>
            Leave the game and the room
          </button>
        </div>
      </div>
    </div>
  );
};

interface Props {}

const CubeGame = (props: Props) => {
  const [cubeID, setCubeID] = useState<string>("");
  const [draftStarted, setDraftStarted] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailCard, setDetailCard] = useState<ICard>();
  const [gameAborded, setGameAborded] = useState(false);

  const {
    socket,
    setSocket,
    setProfile,
    reconnectionParam,
    setReconnectionParam,
  } = React.useContext(GameContext) as GameContextType;
  const navigate = useNavigate();

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setDetailCard(undefined);
  };

  const handleOpenDetailModal = (card: ICard) => {
    setDetailCard(card);
    setOpenDetailModal(true);
  };

  let cgservice: CubeGameService | null = null;
  if (socket) {
    cgservice = new CubeGameService(socket);
  }

  const handleStartGame = () => {
    if (cgservice) {
      cgservice.socket.gameStart(cubeID).then((_cubeID) => {
        setDraftStarted(true);
      });
    }
  };

  const handleLeaveGameRoom = () => {
    if (cgservice) {
      cgservice.socket.disconnect().then(() => {
        setSocket(null);
        setProfile(null);
        setReconnectionParam("undefine");
        navigate("/");
      });
    }
  };

  useEffect(() => {
    if (cgservice) {
      cgservice.socket.onGameStart((res: ICubeDraftStart) => {
        setCubeID(res.cubeID);
        setDraftStarted(true);
      });
      cgservice.socket.onGameAbord(() => {
        setGameAborded(true);
      });
    }
  }, [cgservice]);

  useEffect(() => {
    if (
      cgservice &&
      (reconnectionParam === "draft_start" ||
        reconnectionParam === "draft_over")
    ) {
      cgservice.socket.getCurrentGameState().then((res) => {
        setCubeID(res.cubeID);
        setDraftStarted(true);
      });
    }
  }, [cgservice]);

  return (
    <div className="text-center flex justify-content-center">
      <div>
        {cgservice && !draftStarted && (
          <CubeSelection cgservice={cgservice} setCubeID={setCubeID} />
        )}
        {cubeID && !draftStarted && (
          <button
            className="mt-3 btn btn-outline-primary"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        )}
        {cgservice && cubeID && draftStarted && (
          <CubeDraft
            cubeID={cubeID}
            cgservice={cgservice}
            handleOpenDetailModal={handleOpenDetailModal}
          />
        )}
      </div>
      <CardDetail
        open={openDetailModal}
        card={detailCard}
        closeModal={handleCloseDetailModal}
        cgservice={cgservice}
      />
      <GameAbordedModal
        open={gameAborded}
        handleLeaveGameRoom={handleLeaveGameRoom}
      />
      <RoomModal position="fixed" />
    </div>
  );
};

export default CubeGame;
