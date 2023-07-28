import React from "react";
import { ICard } from "../../types";
import Card from "../Card.component";
import CardsTypeDistribution from "../StatsAndCharts/CardsTypeDistribution.component";

interface Props {
  selectedCard: ICard | null;
}

const DeckExplorerSideInfo = (props: Props) => {
  const { selectedCard } = props;

  return (
    <div className="side-info-card">
      <div className="side-info-details">
        <Card card={selectedCard} size="large" />
        <div className="side-info-attribute">
          <div className="mt-2">{selectedCard?.name}</div>
          <div className="mt-2 mb-4">{selectedCard?._type}</div>
          {selectedCard?.race && (
            <div>
              <span>Race</span>
              <div>{selectedCard?.race}</div>
            </div>
          )}
          {selectedCard?.attribute && (
            <div>
              <span>Attribut</span>
              <div>{selectedCard?.attribute}</div>
            </div>
          )}
          {selectedCard?.level && (
            <div>
              <span>Niveau</span>
              <div>{selectedCard?.level}</div>
            </div>
          )}
          {selectedCard?.atk !== undefined &&
            selectedCard?.def !== undefined && (
              <div className="side-info-attribute-atk-def mt-2">
                <div>
                  <span>Atk:</span>
                  {selectedCard?.atk}
                </div>
                <div>
                  <span>Def:</span>
                  {selectedCard?.def}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="side-info-description">
        <span>Description</span>
        <div className="side-info-description-text">
          {selectedCard?.description}
        </div>
      </div>
    </div>
  );
};

export default DeckExplorerSideInfo;
