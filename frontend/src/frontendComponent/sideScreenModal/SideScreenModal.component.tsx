import React, { ReactElement, useEffect, useState } from "react";
import Icon from "../Icon.components";

type OpenStates = "open" | "reduce" | "close";
type ModalMode = "max-expend" | "normal";

interface Props {
  isDisturbing?: boolean;
  children: ReactElement;
  mode?: ModalMode;
}

function SideScreenModal(props: Props) {
  const { isDisturbing, children, mode } = props;

  const [openState, setOpenState] = useState<OpenStates>("reduce");

  const handleOpenCloseModalExtend = () => {
    if (isDisturbing) {
      switch (openState) {
        case "open":
          setOpenState("close");
          break;
        case "close":
          setOpenState("open");
          break;
        case "reduce":
          setOpenState("open");
          break;
        default:
          setOpenState("reduce");
          break;
      }
    } else {
      switch (openState) {
        case "open":
          setOpenState("reduce");
          break;
        case "close":
          setOpenState("reduce");
          break;
        case "reduce":
          setOpenState("open");
          break;
        default:
          setOpenState("reduce");
          break;
      }
    }
  };

  const handleOpenCloseModalCollapse = () => {
    switch (openState) {
      case "close":
        setOpenState("reduce");
        break;
      case "reduce":
        setOpenState("close");
        break;
      default:
        setOpenState("reduce");
        break;
    }
  };

  useEffect(() => {
    if (isDisturbing && openState === "reduce") {
      setOpenState("close");
    } else if (!isDisturbing && openState === "close" && mode === "max-expend") {
      setOpenState("reduce");
    }
  }, [isDisturbing, mode, openState]);

  return (
    <div className={`side-screen-modal modal-${openState}`}>
      {mode === "max-expend"
        && (
        <div
          className="side-screen-modal-button modal-button-extend"
          onClick={handleOpenCloseModalExtend}
          onKeyDown={handleOpenCloseModalExtend}
          role="button"
          tabIndex={0}
        >
          <Icon
            icon={openState === "open" ? "arrow-right" : "arrow-left"}
            scale="0.7"
            strokeWidth="3"
          />

        </div>
        )}
      {mode === "normal"
        && (
        <div
          className="side-screen-modal-button modal-button-collapse"
          onClick={handleOpenCloseModalCollapse}
          onKeyDown={handleOpenCloseModalCollapse}
          role="button"
          tabIndex={0}
        >
          <Icon
            icon={openState === "reduce" ? "arrow-right" : "arrow-left"}
            scale="0.7"
            strokeWidth="3"
          />
        </div>
        )}
      { mode === "normal" && <div className="normal-body-container">{children }</div> }
      { mode === "max-expend" && children }
    </div>
  );
}

SideScreenModal.defaultProps = {
  isDisturbing: false,
  mode: "normal",
};

export default SideScreenModal;
