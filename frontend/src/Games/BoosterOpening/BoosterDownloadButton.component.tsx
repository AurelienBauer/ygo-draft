import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../frontendComponent/Icon.components";
import { IBuildingDeck } from "../../types";
import { downloadDraft } from "../../service";

interface Props {
  draft: IBuildingDeck;
  filename: string;
}

function BoosterDownloadButton(props: Props) {
  const { draft, filename } = props;
  const { t } = useTranslation();

  return (
    <div>
      <button
        className="btn btn-outline-secondary download-deck-btn"
        onClick={() => downloadDraft(filename, draft)}
        type="button"
      >
        <Icon icon="import" />
        {t("Export all the cards")}
      </button>
    </div>
  );
}

export default BoosterDownloadButton;
