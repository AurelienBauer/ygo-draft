import React, { useEffect, useState } from "react";
import { ICard } from "../../types";

import Icon from "../../frontendComponent/Icon.components";

interface Props {
  cardStack: ICard[];
  playerName: string;
  handleOpenDetailModal: (c: ICard) => void;
  isDisturbing?: boolean;
}

type OpenStates = "open" | "reduce" | "close";

function CubeLastCardPicked(props: Props) {
  const {
    cardStack, playerName, handleOpenDetailModal, isDisturbing,
  } = props;

  const [openState, setOpenState] = useState<OpenStates>("reduce");

  const handleOpenCloseModal = () => {
    if (isDisturbing) {
      switch (openState) {
        case "open":
          setOpenState("close");
          break;
        case "close":
          setOpenState("open");
          break;
        case "reduce":
          setOpenState("open");
          break;
        default:
          break;
      }
    } else {
      switch (openState) {
        case "open":
          setOpenState("reduce");
          break;
        case "close":
          setOpenState("reduce");
          break;
        case "reduce":
          setOpenState("open");
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (isDisturbing && openState === "reduce") {
      setOpenState("close");
    } else if (!isDisturbing && openState === "close") {
      setOpenState("reduce");
    }
  }, [isDisturbing, openState]);

  return (
    <div className={`cube-last-card-picked-modal modal-${openState}`}>
      <div
        className="cube-last-card-picked-side-button"
        onClick={handleOpenCloseModal}
        onKeyDown={handleOpenCloseModal}
        role="button"
        tabIndex={0}
      >
        <Icon
          icon={openState === "open" ? "arrow-right" : "arrow-left"}
          scale="0.7"
          strokeWidth="3"
        />
      </div>
      <div className="cube-last-card-picked-name">
        Cards picked by:
        {" "}
        {playerName}
      </div>
      <div className="last-card-picked-container">
        <div className="last-card-picked">
          {cardStack.slice(0).reverse().map((card: ICard) => (
            <div
              key={`last-card-picked-${card.uuid}`}
              className="last-card-picked-image"
              onClick={() => handleOpenDetailModal(card)}
              onKeyDown={() => handleOpenDetailModal(card)}
              role="button"
              tabIndex={0}
            >
              <img src={card.image_small_url} alt={card.name} />
              <div className="last-card-picked-svg-overlay ">
                <Icon icon="search" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

CubeLastCardPicked.defaultProps = {
  isDisturbing: false,
};

export default CubeLastCardPicked;
