import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import CubeGameService from "./service/CubeGameService";
import CubeSelection from "./CubeSelection.component";
import { ICubeDraftStart } from "./service/CubeGameSocket";
import CubeDraft from "./CubeDraft.component";
import RoomModal from "../../component/GameRoom/RoomModal.component";
import { ICard } from "../../types";
import CardDetail from "../../component/CardDetail.component";

interface PropsGAModal {
  open: boolean;
  handleLeaveGameRoom: () => void;
}

function GameAbordedModal(props: PropsGAModal) {
  const { open, handleLeaveGameRoom } = props;
  const { t } = useTranslation();

  return (
    <div className={`modal small ${open ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-body">
          <div className="text-align-start">
            <h5>{t("Game aborted")}</h5>
            <p>{t("A player has left the room, the game cannot continue.")}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleLeaveGameRoom}
            type="button"
          >
            {t("Leave the game and the room")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CubeGame() {
  const { t } = useTranslation();

  const [cubeID, setCubeID] = useState<string>("");
  const [draftStarted, setDraftStarted] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [detailCard, setDetailCard] = useState<ICard>();
  const [gameAborded, setGameAborded] = useState(false);
  const [cgservice, setCgservice] = useState<CubeGameService | null>(null);

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

  const handleStartGame = () => {
    if (cgservice) {
      cgservice.socket.gameStart(cubeID).then(() => {
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
      if (
        reconnectionParam === "draft_start" || reconnectionParam === "draft_over"
      ) {
        cgservice.socket.getCurrentGameState().then((res) => {
          setCubeID(res.cubeID);
          setDraftStarted(true);
        });
      }
    }
  }, [cgservice, reconnectionParam]);

  useEffect(() => {
    if (cgservice) {
      cgservice.socket.onGameStart((res: ICubeDraftStart) => {
        setCubeID(res.cubeID);
        setDraftStarted(true);
      });
      return () => cgservice.socket.onGameStartUnsubscribe();
    }
    return () => null;
  }, [cgservice]);

  useEffect(() => {
    if (cgservice) {
      cgservice.socket.onGameAbord(() => {
        setGameAborded(true);
      });
      return () => cgservice.socket.onGameAbordUnsubscribe();
    }
    return () => null;
  }, [cgservice]);

  useEffect(() => {
    if (socket) {
      setCgservice(new CubeGameService(socket));
    }
  }, [socket]);

  return (
    <div className="text-center flex justify-content-center">
      <div>
        {cgservice && !draftStarted && (
          <CubeSelection setCubeID={setCubeID} />
        )}
        {cubeID && !draftStarted && (
          <button
            className="mt-3 btn btn-outline-primary"
            onClick={handleStartGame}
            type="button"
          >
            {t("Start Game")}
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
      />
      <GameAbordedModal
        open={gameAborded}
        handleLeaveGameRoom={handleLeaveGameRoom}
      />
      <RoomModal position="fixed" />
    </div>
  );
}

export default CubeGame;
