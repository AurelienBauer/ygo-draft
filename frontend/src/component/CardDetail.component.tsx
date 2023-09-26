import React from "react";
import { useTranslation } from "react-i18next";
import { ICard } from "../types";

interface Props {
  card: ICard | undefined;
  open: boolean;
  closeModal: () => void;
}

function CardDetail(props: Props) {
  const { card, open, closeModal } = props;
  const { t } = useTranslation();

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
              className="unselectable"
              draggable={false}
              src={card?.image_url ? card.image_url : ""}
              alt={card?.name ? card.name : "no_card"}
            />
          </div>
          <div className="modal-card-desc">
            <ul>
              <li>
                <b>
                  {t("Title")}
                  :
                </b>
                {" "}
                {card?.name}
              </li>
              <li>
                <b>{t("Description")}</b>
                {": "}
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
