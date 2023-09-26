import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SideScreenModal from "../../frontendComponent/sideScreenModal/SideScreenModal.component";
import { IBuildingDeckExport, SelectedBooster } from "../../types";
import UploadFile from "../../frontendComponent/UploadFile/UploadFile.component";
import { uploadFile, validateJSONWithJSONSchema } from "../../service";
import { IBuildingDeckJSONSchema } from "./service";

interface Props {
  boosters: SelectedBooster[];
  startDraftHandler: (boosters: SelectedBooster[], extraCards? :IBuildingDeckExport) => void;
}

function BoosterGameSelectionSideModal(props: Props) {
  const { boosters, startDraftHandler } = props;
  const { t } = useTranslation();

  const [extraCards, setExtraCards] = useState<IBuildingDeckExport>();
  const [successUpload, setSuccessUpload] = useState<string>();
  const [errorUpload, setErrorUpload] = useState<string>();

  const getTotalExportCardsNumber = (cardsExport: IBuildingDeckExport) => cardsExport.deck.length
  + cardsExport.extraDeck.length + cardsExport.bookmarked.length + cardsExport.stock.length;

  const onFileUpload = (f: File) => {
    uploadFile(f).then((res) => {
      try {
        return JSON.parse(res);
      } catch (err) {
        throw new Error("Invalid JSON format");
      }
    }).then((res) => {
      if (!validateJSONWithJSONSchema(res, IBuildingDeckJSONSchema)) {
        throw new Error("Invalid file format");
      }
      setErrorUpload(undefined);
      const nbr = getTotalExportCardsNumber(res);
      setSuccessUpload(`${nbr} cards will be imported!`);
      setExtraCards(res);
    }).catch((err: Error) => {
      setSuccessUpload(undefined);
      setErrorUpload(err.message);
    });
  };

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
        <div>
          {successUpload && <span className="success-span">{successUpload}</span>}
          {errorUpload && <span className="error-span">{errorUpload}</span>}
          {!successUpload && !errorUpload && <span className="">{t("Load an old boosters opening")}</span>}
          <UploadFile onFileUpload={onFileUpload} />
        </div>
        <button type="button" className="btn btn-outline-primary mt-2 mb-2" onClick={() => startDraftHandler(boosters, extraCards)}>
          {t("Start Opening")}
        </button>
      </div>
    </SideScreenModal>
  );
}

export default BoosterGameSelectionSideModal;
