import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardDetail from "../../component/CardDetail.component";
import BoosterGameService from "./service/BoosterGameService";
import { BoosterOpened, CardFromPackOpening, ICard } from "../../types";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import BoosterCard from "./BoosterCard.component";
import Icon from "../../frontendComponent/Icon.components";

interface Props {
  bgservice: BoosterGameService;
  handleStartBuilding: () => void;
}

function BoosterGameOpening(props: Props) {
  const { bgservice, handleStartBuilding } = props;

  const [openModal, setOpenModal] = useState(false);
  const [detailCard, setDetailCard] = useState<ICard>();
  const [boosterInfo, setBoosterInfo] = useState<BoosterOpened>();
  const [boosterCards, setBoosterCards] = useState<CardFromPackOpening[]>();

  const { lang } = React.useContext(
    GameContext,
  ) as GameContextType;

  const { t } = useTranslation();

  const handleCloseDetailModal = () => {
    setOpenModal(false);
  };

  const handleOpenDetailModal = (card: ICard) => {
    setOpenModal(true);
    setDetailCard(card);
  };

  const handleBookmarkACard = (cardUUID: string) => {
    const card = boosterCards?.find((c) => c.uuid === cardUUID);
    const bookOrUnBookmark = (book: boolean) => setBoosterCards(boosterCards?.map((c) => {
      if (c.uuid === cardUUID) {
        return { ...c, bookMarked: book };
      }
      return { ...c };
    }));

    if (card) {
      if (card.bookMarked) {
        bgservice.socket.unBookmarkCard(cardUUID).then(() => bookOrUnBookmark(false));
      } else {
        bgservice.socket.bookmarkCard(cardUUID).then(() => bookOrUnBookmark(true));
      }
    }
  };

  const handleOpenNextBooster = () => {
    bgservice.socket.open(lang).then((res) => {
      setBoosterInfo(res);
      setBoosterCards(res.cards.map((c) => ({ ...c, show: false, bookMarked: false })));
    });
  };

  const handleFlipAllCards = () => {
    setBoosterCards(boosterCards?.map((c) => ({ ...c, show: true })));
  };

  const handleFlipCard = (cardUUID: string) => {
    setBoosterCards(boosterCards?.map((c) => {
      if (c.uuid === cardUUID) {
        return { ...c, show: true };
      }
      return { ...c };
    }));
  };

  useEffect(() => {
    if (bgservice.socket && !boosterCards) {
      bgservice.socket.open(lang).then((res) => {
        setBoosterInfo(res);
        setBoosterCards(res.cards.map((c) => ({ ...c, show: false, bookMarked: false })));
      }).catch((err) => {
        if (err?.errorDetails === "Error: There is no boosters left") {
          handleStartBuilding();
        }
      });
    }
  }, [bgservice.socket, handleStartBuilding]);

  return (
    <div>
      {boosterInfo
        && (
        <div>
          <div>{boosterInfo.name}</div>
          <div className="booster-cards-container">
            {boosterCards?.map((c) => (
              <div onClick={() => handleFlipCard(c.uuid)} onKeyDown={() => handleFlipCard(c.uuid)} key={c.uuid} role="button" tabIndex={0}>
                <BoosterCard
                  card={c}
                  show={c.show}
                  handleOpenCardDetail={handleOpenDetailModal}
                  handleBookmarkACard={() => handleBookmarkACard(c.uuid)}
                />
              </div>
            ))}
          </div>
          <div>
            <button type="button" className="btn btn-secondary mb-1 mr-2" onClick={() => handleFlipAllCards()}>
              <div className="booster-flip-all-cards-icon">
                <Icon icon="reload" scale="1.2" />
              </div>
              {t("Flip All the Cards")}
            </button>
            {boosterInfo.cardsLeft > 0 ? (
              <button type="button" className="btn btn-primary mb-1 ml-2" onClick={() => handleOpenNextBooster()}>
                {t("Next Booster")}
              </button>
            ) : (
              <button type="button" className="btn btn-primary mb-1 ml-2" onClick={handleStartBuilding}>
                {t("Start Deck Building")}
              </button>
            )}
          </div>
        </div>
        )}
      <CardDetail open={openModal} card={detailCard} closeModal={handleCloseDetailModal} />
    </div>
  );
}

export default BoosterGameOpening;
