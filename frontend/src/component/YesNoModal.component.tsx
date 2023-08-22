import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  text: string;
  handleNoResponse: (...args: never[]) => void;
  handleYesResponse: (...args: never[]) => void;
}

function YesNoModal(props: Props) {
  const {
    open, handleYesResponse, handleNoResponse, text,
  } = props;
  const { t } = useTranslation();

  return (
    <div className={`modal small ${open ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-body">
          <div className="text-align-start">
            <h5>{t("Confirm Action")}</h5>
            <p>{text}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleNoResponse} onKeyDown={handleNoResponse} type="button">
            {t("No")}
          </button>
          <button className="btn btn-primary" onClick={handleYesResponse} onKeyDown={handleYesResponse} type="button">
            {t("Yes")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default YesNoModal;
