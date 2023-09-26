import React, {
  ChangeEvent, useContext, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";
import BoosterGameRest from "./service/BoosterGameRest";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import BoosterGameSelectionSideModal from "./BoosterGameSelectionSideModal.component";
import { IBuildingDeckExport, SelectedBooster } from "../../types";
import BoosterGameService from "./service/BoosterGameService";

interface Props {
  bgservice: BoosterGameService;
  handleStartOpening: () => void;
}

function BoosterGameSelection(props: Props) {
  const { bgservice, handleStartOpening } = props;
  const [boosters, setBoosters] = useState<SelectedBooster[]>([]);

  const { lang } = useContext(
    GameContext,
  ) as GameContextType;

  const { t } = useTranslation();

  const handleBooster = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const number = Number(e.target.value);
    if ((number || number === 0) && number >= 0) {
      setBoosters(boosters.map((b) => {
        if (b.boosterId === id) {
          return { ...b, number };
        }
        return { ...b };
      }));
    }
  };

  const handleSelectedBooster = (
    boostersSelected: SelectedBooster[],
    extraCards? :IBuildingDeckExport,
  ) => {
    const b = boostersSelected
      .filter((bt) => bt.number > 0)
      .map((bt) => ({
        boosterId: bt.boosterId,
        number: bt.number,
      }));

    bgservice.socket.startOpening(b)
      .then(() => {
        if (extraCards) {
          return bgservice.socket.loadExtraCard({ export: extraCards, lang });
        }
        return null;
      })
      .then(() => {
        handleStartOpening();
      });
  };

  useEffect(() => {
    BoosterGameRest.getBoosters().then((res) => {
      setBoosters(res
        .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
        .map((b) => ({
          boosterId: b.id,
          boosterName: (lang === "fr" && b.name_fr) ? b.name_fr : b.name,
          imageUrl: b.image_url,
          number: 0,
        })));
    });
  }, []);

  return (
    <div>
      <h1>{t("BOOSTER SELECTION")}</h1>
      <div className="booster-selection-container">
        {boosters.map((b) => (
          <div key={b.boosterId} className="booster-container">
            <h5>{b.boosterName}</h5>
            <div className="booster-image">
              <img className="unselectable" draggable={false} src={b.imageUrl} alt={b.boosterName} />
            </div>
            <div className="booster-number-input">
              <span>
                {t("Number")}
                :
                {" "}
              </span>
              <input
                type="number"
                onChange={(e) => handleBooster(e, b.boosterId)}
                value={b.number}
              />
            </div>
          </div>
        ))}
      </div>
      <BoosterGameSelectionSideModal
        boosters={boosters}
        startDraftHandler={handleSelectedBooster}
      />
    </div>
  );
}

export default BoosterGameSelection;
