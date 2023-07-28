import React from "react";
import {
  VerticalRotateListGroup,
  VerticalRotateListItem,
} from "../frontendComponent/VerticalRotateList.component";
import { IPlayer } from "../types";

interface Props {
  players: IPlayer[];
  currentPlayerUUID: string;
}
const ListOfPlayer = (props: Props) => {
  const { players, currentPlayerUUID } = props;
  return players?.length ? (
    <VerticalRotateListGroup value={currentPlayerUUID}>
      {players.map((p: IPlayer) => (
        <VerticalRotateListItem key="" value={p.uuid} text={p.name} />
      ))}
    </VerticalRotateListGroup>
  ) : (
    <></>
  );
};

export default ListOfPlayer;
