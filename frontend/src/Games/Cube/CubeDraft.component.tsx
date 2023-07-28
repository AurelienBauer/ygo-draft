import React, { Dispatch, useEffect, useRef, useState } from "react";
import CubeGameService, { ICube } from "./service/CubeGameService";
import { ICard, IPlayer } from "../../types";
import CubeDraftPrimary from "./CubeDraftPrimary.component";
import CubeDraftSecondary from "./CubeDraftSecondary.component";
import CubeLastCardPicked from "./CubeLastCardPicked.component";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import DownloadDeckButton from "../../component/DownloadDeckButton.component";

interface Props {
  cgservice: CubeGameService;
  cubeID: string;
  handleOpenDetailModal: (c: ICard) => void;
}

export interface DecksByPlayer {
  player: IPlayer;
  deck: ICard[];
}

const CubeDraft = (props: Props) => {
  const { cubeID, cgservice, handleOpenDetailModal } = props;

  const [cube, setCube] = useState<ICube>();
  const [decksByPlayer, setDecksByPlayer] = useState<DecksByPlayer[]>([]);
  const [isDraftOver, setIsDraftOver] = useState<boolean>(false);
  const [modalAreIntersecting, setModalAreIntersecting] =
    useState<boolean>(false);

  const refIntersecting = useRef<HTMLDivElement>(null);

  const { reconnectionParam, profile } = React.useContext(
    GameContext
  ) as GameContextType;

  const deckName = `${new Date().toJSON().slice(0, 10)}-${cube?.name}-${
    profile?.name ?? "unknown"
  }`;

  const addCardToPlayerDeck = (playerUUID: string, card: ICard) => {
    setDecksByPlayer(
      decksByPlayer.map((d) => {
        if (d?.deck && d.player.uuid === playerUUID) {
          if (!d.deck.find((c) => c.uuid === card.uuid)) {
            const updatedDeck = [...d.deck, card]; // Create a new array by spreading the existing deck and adding the new card
            return { ...d, deck: updatedDeck }; // Create a new object with the updated deck property
          }
        }
        return d;
      })
    );
  };

  useEffect(() => {
    if (cubeID) {
      cgservice.rest.getCubeById(cubeID).then((cube) => {
        setCube(cube);
      });
    }
  }, [cubeID]);

  useEffect(() => {
    if (cube) {
      cgservice.socket.getCurrentGameState().then((gamecube) => {
        setDecksByPlayer(
          gamecube.playersInGame.map((pig) => ({
            player: pig.player,
            deck:
              cube?.cards.filter(
                (c) =>
                  pig?.deck && pig?.deck.length && pig.deck.includes(c.uuid)
              ) ?? [],
          }))
        );
      });

      cgservice.socket.onDraftOver(() => {
        setIsDraftOver(true);
      });
    }
  }, [cube, cgservice]);

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
      { threshold: 0.8 }
    );
    if (refIntersecting.current) {
      observer.observe(refIntersecting.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <h1>{cube?.name}</h1>
      {isDraftOver ? (
        <div>
          <h2 className="big-blue-text mt-5 mb-5">DRAFT OVER</h2>
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
        <CubeDraftSecondary
          cube={cube}
          decksByPlayer={decksByPlayer}
          deckName={deckName}
        />
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
};

export default CubeDraft;
