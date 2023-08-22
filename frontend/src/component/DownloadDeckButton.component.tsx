import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../frontendComponent/Icon.components";
import { downloadDeck } from "../service";
import { ICard } from "../types";

interface Props {
  type?: "icon" | "button";
  deck: ICard[];
  filename: string;
}

function DownloadDeckButton(props: Props) {
  const { type, deck, filename } = props;
  const { t } = useTranslation();

  return type === "icon" ? (
    <button
      onClick={() => downloadDeck(filename, deck)}
      className="btn download-deck-icon"
      type="button"
    >
      <Icon icon="import" strokeColor="#b6b6b6" />
    </button>
  ) : (
    <div>
      <button
        className="btn btn-outline-primary download-deck-btn"
        onClick={() => downloadDeck(filename, deck)}
        type="button"
      >
        <Icon icon="import" />
        {t("Download the Deck")}
      </button>
    </div>
  );
}

DownloadDeckButton.defaultProps = {
  type: "button",
};

export default DownloadDeckButton;
