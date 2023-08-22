import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardDetail from "../../component/CardDetail.component";
import BoosterGameService from "./service/BoosterGameService";
import { BoosterOpened, ICard } from "../../types";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import BoosterCard from "../../component/BoosterCard.component";

interface Props {
  bgservice: BoosterGameService;
  handleStartBuilding: () => void;
}

function BoosterGameOpening(props: Props) {
  const { bgservice, handleStartBuilding } = props;

  const [openModal, setOpenModal] = useState(false);
  const [detailCard, setDetailCard] = useState<ICard>();
  const [boosterCards, setBoosterCards] = useState<BoosterOpened>();

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

  const handleOpenNextBooster = () => {
    bgservice.socket.open(lang).then((res) => {
      setBoosterCards(res);
    });
  };

  useEffect(() => {
    if (bgservice.socket && !boosterCards) {
      bgservice.socket.open(lang).then((res) => {
        setBoosterCards(res);
      });
    }
  }, []);

  return (
    <div>
      {boosterCards
        && (
        <div>
          <div>{boosterCards.name}</div>
          <div className="booster-cards-container">
            {boosterCards.cards.map((c) => <BoosterCard card={c} key={c.uuid} />)}
          </div>
          {boosterCards.cardsLeft > 0 ? (
            <button type="button" className="btn btn-primary mb-1" onClick={() => handleOpenNextBooster()}>
              {t("Next Booster")}
            </button>
          ) : (
            <button type="button" className="btn btn-primary mb-1" onClick={handleStartBuilding}>
              {t("Start Deck Building")}
            </button>
          )}
        </div>
        )}
      <CardDetail open={openModal} card={detailCard} closeModal={handleCloseDetailModal} />
    </div>
  );
}

export default BoosterGameOpening;
