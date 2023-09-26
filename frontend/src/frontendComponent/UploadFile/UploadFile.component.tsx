import React, { useState } from "react";
import Icon from "../Icon.components";
import "./styles.scss";

interface Props {
  onFileUpload: (f: File) => void;
  text?: string;
  id?: string;
}

function UploadFile(props: Props) {
  const { text, id, onFileUpload } = props;

  const [fileName, setFileName] = useState<string>();

  const handleOnUploadFile = (files: FileList | null) => {
    if (files?.length) {
      setFileName(files[0].name);
      onFileUpload(files[0]);
    }
  };

  return (
    <>
      <label htmlFor={id} className="uploadfile-label">
        <div className="uploadfile-icon"><Icon icon="import" /></div>
        <div className="uploadfile-text">{fileName ?? text}</div>
      </label>
      <input
        className="uploadfile-input"
        onChange={(e) => handleOnUploadFile(e.target.files)}
        type="file"
        id={id}
        accept="application/JSON"
      />
    </>
  );
}

UploadFile.defaultProps = {
  text: "Upload",
  id: "upload-file",
};

export default UploadFile;
