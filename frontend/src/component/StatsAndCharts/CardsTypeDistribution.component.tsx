import React, { useEffect, useState } from "react";
import { ICard } from "../../types";

interface Props {
  deck: ICard[];
}

interface TypesDistribution {
  gTarp: number;
  gSpell: number;
  gMonster: number;
  effectMonster?: number;
  normalMonster?: number;
  fripMonster?: number;
}

const TRAP_TYPE = "Trap Card";
const SPELL_TYPE = "Spell Card";
const EFFECT_MONSTER_TYPE = "Effect Monster";
const NORMAL_MONSTER_TYPE = "Normal Monster";
const FLIP_EFFECT_MONSTER_TYPE = "Flip Effect Monster";

const CardsTypeDistribution = (props: Props) => {
  const { deck } = props;
  const [typesDis, setTypesDis] = useState<TypesDistribution>({
    gTarp: 0,
    gSpell: 0,
    gMonster: 0,
  });

  const isSpell = (type: string) => type === SPELL_TYPE;
  const isTrap = (type: string) => type === TRAP_TYPE;

  const isMonster = (type: string) =>
    type === EFFECT_MONSTER_TYPE ||
    type === FLIP_EFFECT_MONSTER_TYPE ||
    type === NORMAL_MONSTER_TYPE;

  useEffect(() => {
    const nbrSpell = deck.filter((c: ICard) => isSpell(c._type)).length;
    const nbrTrap = deck.filter((c: ICard) => isTrap(c._type)).length;
    const nbrMonster = deck.filter((c: ICard) => isMonster(c._type)).length;

    setTypesDis({
      gSpell: nbrSpell,
      gTarp: nbrTrap,
      gMonster: nbrMonster,
    });
  }, [deck]);

  return (
    <div>
      <div>Monster cards: {typesDis.gMonster}</div>
      <div>Magic cards: {typesDis.gSpell}</div>
      <div>Trap cards: {typesDis.gTarp}</div>
    </div>
  );
};

export default CardsTypeDistribution;
