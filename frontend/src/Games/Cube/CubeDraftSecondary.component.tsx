import { downloadDeck } from "../../service";
import { ICube } from "./service/CubeGameService";
import React, { useState } from "react";
import { DecksByPlayer } from "./CubeDraft.component";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import DeckExplorer from "../../component/DeckExplorer/DeckExplorer.component";

interface Props {
  cube?: ICube;
  decksByPlayer: DecksByPlayer[];
}

const CubeDraftSecondary = (props: Props) => {
  const { cube, decksByPlayer } = props;

  const { profile } = React.useContext(GameContext) as GameContextType;

  const [activeTab, setActiveTab] = useState<string>(profile?.uuid || "");

  return (
    <div className="section">
      <div className="mt-3 large-container mb-3">
        <ul className="nav nav-tabs">
          {decksByPlayer.map(({ player }) => (
            <li
              key={`tab-head-${player.uuid}`}
              className="nav-item"
              onClick={() => setActiveTab(player.uuid)}
            >
              <b
                className={`nav-link ${
                  activeTab === player.uuid ? "active" : ""
                }`}
              >
                {player.name}
              </b>
            </li>
          ))}
        </ul>
        {decksByPlayer.map(
          ({ player, deck }) =>
            player.uuid === activeTab && (
              <DeckExplorer key={`tab-body-${player.uuid}`} deck={deck} />
              // <div  className="mt-3 flex">
              //   <div className="">
              //   </div>
              //   <div className="m-3">
              //     <CardsTypeDistribution deck={deck} />
              //     <div>Number of Cards: {deck.length}</div>
              //     {deck.length > 0 && (
              //       <div className="mt-3">
              //         <button
              //           onClick={() =>
              //             downloadDeck(`${cube?.name} - ${player.name}`, deck)
              //           }
              //           className="btn btn-secondary btn-sm"
              //         >
              //           Download Deck
              //         </button>
              //       </div>
              //     )}
              //   </div>
              // </div>
            )
        )}
      </div>
    </div>
  );
};

export default CubeDraftSecondary;
