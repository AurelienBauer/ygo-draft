/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ICard } from "../../types";
import SimplePieChart from "../StatsAndCharts/SimplePieChart.component";

interface Props {
  deck: ICard[];
}

interface TypesDistribution {
  gTarp: number;
  gSpell: number;
  gMonster: number;
  effectMonster: number;
  normalMonster: number;
}

const TRAP_TYPE = "Trap Card";
const SPELL_TYPE = "Spell Card";
const EFFECT_MONSTER_TYPE = "Effect Monster";
const NORMAL_MONSTER_TYPE = "Normal Monster";
const FLIP_EFFECT_MONSTER_TYPE = "Flip Effect Monster";

function CardsTypeDistribution(props: Props) {
  const { deck } = props;
  const { t } = useTranslation();

  const [typesDis, setTypesDis] = useState<TypesDistribution>({
    gTarp: 0,
    gSpell: 0,
    gMonster: 0,
    effectMonster: 0,
    normalMonster: 0,
  });

  const isSpell = (type: string) => type === SPELL_TYPE;
  const isTrap = (type: string) => type === TRAP_TYPE;

  const isMonster = (type: string) => type === EFFECT_MONSTER_TYPE
    || type === FLIP_EFFECT_MONSTER_TYPE
    || type === NORMAL_MONSTER_TYPE;

  const isEffectMonster = (type: string) => type === EFFECT_MONSTER_TYPE
  || type === FLIP_EFFECT_MONSTER_TYPE;

  const isNormalMonster = (type: string) => type === NORMAL_MONSTER_TYPE;

  useEffect(() => {
    const nbrSpell = deck.filter((c: ICard) => isSpell(c._type)).length;
    const nbrTrap = deck.filter((c: ICard) => isTrap(c._type)).length;
    const nbrMonster = deck.filter((c: ICard) => isMonster(c._type)).length;
    const nbrEffectMonster = deck.filter((c: ICard) => isEffectMonster(c._type)).length;
    const nbrNormalMonster = deck.filter((c: ICard) => isNormalMonster(c._type)).length;

    setTypesDis({
      gSpell: nbrSpell,
      gTarp: nbrTrap,
      gMonster: nbrMonster,
      effectMonster: nbrEffectMonster,
      normalMonster: nbrNormalMonster,
    });
  }, [deck]);

  return (
    <div className="deck-explorer-stat-pie-distribution">
      <div>
        <SimplePieChart
          centerValue={deck.length.toString()}
          data={[
            {
              id: "Monsters",
              label: t("Monsters"),
              value: typesDis.gMonster,
              color: "#d5ba8e",
            },
            {
              id: "Spells",
              label: t("Spells"),
              value: typesDis.gSpell,
              color: "#52aaa1",
            },
            {
              id: "Traps",
              label: t("Traps"),
              value: typesDis.gTarp,
              color: "#be6696",
            },
          ]}
        />
        <span>{t("Cards distribution")}</span>
      </div>
      <div>
        <SimplePieChart
          centerValue={typesDis.gMonster.toString()}
          data={[
            {
              id: "Normal",
              label: t("Normal Monsters"),
              value: typesDis.normalMonster,
              color: "#d5ba8e",
            },
            {
              id: "Effect",
              label: t("Effect Monsters"),
              value: typesDis.effectMonster,
              color: "#b0461d",
            },
          ]}
        />
        <span>{t("Monsters distribution (Normal / Effect)")}</span>
      </div>
    </div>
  );
}

export default CardsTypeDistribution;
