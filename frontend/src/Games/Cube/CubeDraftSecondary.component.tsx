import { ICube } from "./service/CubeGameService";
import React, { useState } from "react";
import { DecksByPlayer } from "./CubeDraft.component";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import DeckExplorer from "../../component/DeckExplorer/DeckExplorer.component";

interface Props {
  cube?: ICube;
  decksByPlayer: DecksByPlayer[];
  deckName: string;
}

const CubeDraftSecondary = (props: Props) => {
  const { cube, decksByPlayer, deckName } = props;

  const { profile } = React.useContext(GameContext) as GameContextType;

  const [activeTab, setActiveTab] = useState<string>(profile?.uuid ?? "");

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
              <DeckExplorer
                key={`tab-body-${player.uuid}`}
                deck={deck}
                deckName={deckName}
              />
            )
        )}
      </div>
    </div>
  );
};

export default CubeDraftSecondary;
