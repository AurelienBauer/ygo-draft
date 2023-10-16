import React from "react";
import { useTranslation } from "react-i18next";
import SideScreenModal from "../../frontendComponent/sideScreenModal/SideScreenModal.component";
import { BoosterOpened, SelectedBooster } from "../../types";
import { sortAndMapBoostersOpeningList } from "./service";

interface Props {
  booster: BoosterOpened;
}

function BoosterGameOpeningSideModal(props: Props) {
  const { booster } = props;
  const { t } = useTranslation();

  return (
    <SideScreenModal>
      <div>
        <div className="mt-1">
          {t("Booster left")}
          {" "}
          { booster.cardsLeft }
          <div className="booster-selection-box mt-1">
            {sortAndMapBoostersOpeningList(booster.boosterLeft).map((b: SelectedBooster) => (
              <div key={b.boosterId} className="mb-2 mt-2 booster-left-image flex align-items-center">
                <img src={b.imageUrl} alt={b.boosterName} className="mr-2" />
                <div>
                  {b.boosterName}
                  {" "}
                  x
                  {b.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SideScreenModal>
  );
}

export default BoosterGameOpeningSideModal;
