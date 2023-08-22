import React, {
  useCallback, useEffect, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";
import CubeGameService from "./service/CubeGameService";
import { DecksByPlayer, ICard, ICube } from "../../types";
import CubeDraftPrimary from "./CubeDraftPrimary.component";
import CubeDraftSecondary from "./CubeDraftSecondary.component";
import CubeLastCardPicked from "./CubeLastCardPicked.component";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import DownloadDeckButton from "../../component/DownloadDeckButton.component";
import CubeGameRest from "./service/CubeGameRest";

interface Props {
  cgservice: CubeGameService;
  cubeID: string;
  handleOpenDetailModal: (c: ICard) => void;
}

function CubeDraft(props: Props) {
  const { cubeID, cgservice, handleOpenDetailModal } = props;
  const { t } = useTranslation();

  const [cube, setCube] = useState<ICube>();
  const [decksByPlayer, setDecksByPlayer] = useState<DecksByPlayer[]>([]);
  const [isDraftOver, setIsDraftOver] = useState<boolean>(false);
  const [modalAreIntersecting, setModalAreIntersecting] = useState<boolean>(false);

  const refIntersecting = useRef<HTMLDivElement>(null);

  const { reconnectionParam, profile, lang } = React.useContext(
    GameContext,
  ) as GameContextType;

  const deckName = `${new Date().toJSON().slice(0, 10)}-${cube?.name}-${
    profile?.name ?? "unknown"
  }`;

  const addCardToPlayerDeck = useCallback(
    (playerUUID: string, card: ICard) => {
      setDecksByPlayer(
        decksByPlayer.map((d) => {
          if (d?.deck && d.player.uuid === playerUUID) {
            if (!d.deck.find((c) => c.uuid === card.uuid)) {
              // Create a new array by spreading the existing deck and adding the new card
              const updatedDeck = [...d.deck, card];
              // Create a new object with the updated deck property
              return { ...d, deck: updatedDeck };
            }
          }
          return { ...d };
        }),
      );
    },
    [decksByPlayer],
  );

  useEffect(() => {
    if (cubeID) {
      CubeGameRest.getCubeById(cubeID, lang).then((c) => {
        setCube(c);
      });
    }
  }, [cubeID, lang]);

  useEffect(() => {
    if (cube) {
      cgservice.socket.getCurrentGameState().then((gamecube) => {
        setDecksByPlayer(
          gamecube.playersInGame.map((pig) => ({
            player: pig.player,
            deck: pig.deck.map((cardUUid) => {
              const card = cube.cards.filter((c) => c.uuid === cardUUid);
              return card?.[0] || {};
            }),
          })),
        );
      });
    }
  }, [cgservice, cube]);

  useEffect(() => {
    cgservice.socket.onDraftOver(() => {
      setIsDraftOver(true);
    });
    return () => cgservice.socket.onDraftOverUnsubscribe();
  }, [cgservice]);

  useEffect(() => {
    if (reconnectionParam === "draft_over") {
      setIsDraftOver(true);
    }
  }, [reconnectionParam]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setModalAreIntersecting(entry.isIntersecting);
      },
      { threshold: 0.8 },
    );
    if (refIntersecting.current) {
      observer.observe(refIntersecting.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <h1>{cube?.name.toUpperCase()}</h1>
      {isDraftOver ? (
        <div>
          <h2 className="big-blue-text mt-5 mb-5">{t("DRAFT OVER")}</h2>
          <DownloadDeckButton
            type="button"
            deck={
              decksByPlayer.find((dbp) => dbp.player.uuid === profile?.uuid)
                ?.deck ?? []
            }
            filename={deckName}
          />
        </div>
      ) : (
        <CubeDraftPrimary
          cube={cube}
          cgservice={cgservice}
          addCardToPlayerDeck={addCardToPlayerDeck}
          handleOpenDetailModal={handleOpenDetailModal}
        />
      )}
      <div ref={refIntersecting}>
        <CubeDraftSecondary decksByPlayer={decksByPlayer} deckName={deckName} />
      </div>
      <div className="cube-last-card-picked-modal-container hidden-scroll">
        {decksByPlayer.map((dbp) => (
          <CubeLastCardPicked
            key={`dbp-${dbp.player.uuid}`}
            cardStack={dbp.deck}
            playerName={dbp.player.name}
            handleOpenDetailModal={handleOpenDetailModal}
            isDisturbing={modalAreIntersecting}
          />
        ))}
      </div>
    </>
  );
}

export default CubeDraft;
