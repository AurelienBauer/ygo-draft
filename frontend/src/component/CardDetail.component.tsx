import React from "react";
import { ICard } from "../types";

interface Props {
  card: ICard | undefined;
  open: boolean;
  closeModal: () => void;
}

function CardDetail(props: Props) {
  const { card, open, closeModal } = props;

  return (
    <div className={`modal ${open ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{card?.name}</h3>
          <span className="close" onClick={closeModal} onKeyDown={closeModal} role="button" tabIndex={0}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <div className="modal-card-pic">
            <img
              src={card?.image_url ? card.image_url : ""}
              alt={card?.name ? card.name : "no_card"}
            />
          </div>
          <div className="modal-card-desc">
            <ul>
              <li>
                <b>French name:</b>
                {" "}
                {card?.name}
              </li>
              <li>
                <b>Description:</b>
                {" "}
                <p>{card?.description}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
