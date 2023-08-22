import React from "react";
import { useTranslation } from "react-i18next";
import { ICard } from "../../types";
import Card from "../Card.component";

interface Props {
  selectedCard: ICard | null;
}

function DeckExplorerSideInfo(props: Props) {
  const { selectedCard } = props;
  const { t } = useTranslation();

  return (
    <div className="side-info-card">
      <div className="side-info-details">
        <Card card={selectedCard} size="large" />
        <div className="side-info-attribute">
          <div className="mt-2">{selectedCard?.name}</div>
          {/* eslint-disable-next-line no-underscore-dangle */}
          <div className="mt-2 mb-4">{selectedCard?._type}</div>
          {selectedCard?.race && (
            <div>
              <span>{t("Race")}</span>
              <div>{selectedCard?.race}</div>
            </div>
          )}
          {selectedCard?.attribute && (
            <div>
              <span>{t("Attribut")}</span>
              <div>{selectedCard?.attribute}</div>
            </div>
          )}
          {selectedCard?.level && (
            <div>
              <span>{t("Level")}</span>
              <div>{selectedCard?.level}</div>
            </div>
          )}
          {selectedCard?.atk !== undefined
            && selectedCard?.def !== undefined && (
              <div className="side-info-attribute-atk-def mt-2">
                <div>
                  <span className="mr-1">
                    {t("Atk")}
                    :
                  </span>
                  {selectedCard?.atk}
                </div>
                <div>
                  <span className="mr-1">
                    {t("Def")}
                    :
                  </span>
                  {selectedCard?.def}
                </div>
              </div>
          )}
        </div>
      </div>
      <div className="side-info-description">
        <span>{t("Description")}</span>
        <div className="side-info-description-text">
          {selectedCard?.description}
        </div>
      </div>
    </div>
  );
}

export default DeckExplorerSideInfo;
