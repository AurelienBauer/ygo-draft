import React, { Dispatch, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeckBuilderFilter } from "../../types";
import { cardLevels, cardTypes } from "../../service";
import Icon from "../../frontendComponent/Icon.components";
import IconImage from "../../frontendComponent/IconImage.component";

interface Props {
  setSearchFilter: Dispatch<DeckBuilderFilter>
}

function DeckBuilderSearchFields(props: Props) {
  const { setSearchFilter } = props;

  const { t } = useTranslation();

  const [search, setSearch] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
  };

  useEffect(() => {
    setSearchFilter({
      search, type, level,
    });
  }, [search, type, level, setSearchFilter]);

  return (
    <div className="deck-builder-search-menu">
      <div className="deck-builder-search-search">
        <div className="deck-builder-search-search-icon"><Icon icon="search" /></div>
        <input type="text" value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder={t("Search...")} />
      </div>
      <div className="deck-builder-search-type">
        <div className="deck-builder-search-type-span">
          <span>Card Type</span>
        </div>
        <select id="cardsTypeId" name="cardsType" value={type} onChange={(e) => handleTypeChange(e.target.value)}>
          <option value="">{t("All")}</option>
          {cardTypes.map((ty) => <option key={ty.name} value={ty.name}>{t(ty.name)}</option>)}
        </select>
      </div>
      <div className="deck-builder-search-level">
        <div className="deck-builder-search-level-icon">
          <IconImage src="img/ygo-star.png" alt="ygo-star" />
        </div>
        <select id="cardsLevelId" name="cardsLevel" value={level} onChange={(e) => handleLevelChange(e.target.value)}>
          <option value="">{t("All")}</option>
          {cardLevels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}

export default DeckBuilderSearchFields;
