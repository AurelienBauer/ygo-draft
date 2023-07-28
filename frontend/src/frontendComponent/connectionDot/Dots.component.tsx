import React from "react";
import { Tooltip } from "react-tooltip";

interface Props {
  state: string;
}

const Dot = ({ state }: Props) => {
  let ringColor = "";

  switch (state) {
    case "disconnected":
      ringColor = "red-ring";
      break;
    default:
      ringColor = "green-ring";
      break;
  }

  return (
    <div className={`ring-container ${ringColor}`}>
      {state !== "disconnected" && <div className="ringring" />}
      <div className="circle"></div>
    </div>
  );
};

const ConnectionDot = () => (
  <div data-tooltip-id="tt-connection-dot" data-tooltip-content="Connected">
    <Dot state="connected" />
    <Tooltip id="tt-connection-dot" />
  </div>
);

const DisconnectionDot = () => (
  <div
    data-tooltip-id="tt-disconnection-dot"
    data-tooltip-content="Disconnected"
  >
    <Dot state="disconnected" />
    <Tooltip id="tt-disconnection-dot" />
  </div>
);

export { ConnectionDot, DisconnectionDot };
