import React from "react";
import { Tooltip } from "react-tooltip";

interface Props {
  state: string;
}

function Dot({ state }: Props) {
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
      <div className="circle" />
    </div>
  );
}

function ConnectionDot() {
  return (
    <div data-tooltip-id="tt-connection-dot" data-tooltip-content="Connected">
      <Dot state="connected" />
      <Tooltip id="tt-connection-dot" />
    </div>
  );
}

function DisconnectionDot() {
  return (
    <div
      data-tooltip-id="tt-disconnection-dot"
      data-tooltip-content="Disconnected"
    >
      <Dot state="disconnected" />
      <Tooltip id="tt-disconnection-dot" />
    </div>
  );
}

export { ConnectionDot, DisconnectionDot };
