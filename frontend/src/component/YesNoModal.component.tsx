import React from "react";

interface Props {
  open: boolean;
  text: string;
  handleNoResponse: (...args: any[]) => void;
  handleYesResponse: (...args: any[]) => void;
}

const YesNoModal = (props: Props) => {
  const { open, handleYesResponse, handleNoResponse, text } = props;
  return (
    <div className={`modal small ${open ? "open" : ""}`}>
      <div className="modal-content">
        <div className="modal-body">
          <div className="text-align-start">
            <h5>Confirm Action</h5>
            <p>{text}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleNoResponse}>
            No
          </button>
          <button className="btn btn-primary" onClick={handleYesResponse}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoModal;
