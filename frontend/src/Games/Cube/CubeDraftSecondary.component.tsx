import React, { useState } from "react";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import DeckExplorer from "../../component/DeckExplorer/DeckExplorer.component";
import { DecksByPlayer } from "../../types";

interface Props {
  decksByPlayer: DecksByPlayer[];
  deckName: string;
}

function CubeDraftSecondary(props: Props) {
  const { decksByPlayer, deckName } = props;

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
              onKeyDown={() => setActiveTab(player.uuid)}
              role="tab"
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
          ({ player, deck }) => player.uuid === activeTab && (
          <DeckExplorer
            key={`tab-body-${player.uuid}`}
            deck={deck}
            deckName={deckName}
          />
          ),
        )}
      </div>
    </div>
  );
}

export default CubeDraftSecondary;
