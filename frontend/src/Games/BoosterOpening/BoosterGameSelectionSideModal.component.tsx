import React from "react";
import { useTranslation } from "react-i18next";
import SideScreenModal from "../../frontendComponent/sideScreenModal/SideScreenModal.component";
import { SelectedBooster } from "../../types";

interface Props {
  boosters: SelectedBooster[];
  startDraftHandler: (boosters: SelectedBooster[]) => void;
}

function BoosterGameSelectionSideModal(props: Props) {
  const { boosters, startDraftHandler } = props;
  const { t } = useTranslation();

  return (
    <SideScreenModal>
      <div>
        <div className="booster-selection-box mt-1">
          {boosters.map((b) => b.number > 0 && (
          <div key={b.boosterId} className="mb-1">
            {b.boosterName}
            {" "}
            x
            {b.number}
          </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary mt-2 mb-2" onClick={() => startDraftHandler(boosters)}>
          {t("Start Opening")}
        </button>
      </div>
    </SideScreenModal>
  );
}

export default BoosterGameSelectionSideModal;
