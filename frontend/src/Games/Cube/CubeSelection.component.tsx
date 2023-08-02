/* eslint-disable no-underscore-dangle */
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { GameContext, GameContextType } from "../../component/Game/GameContext";
import { ICube } from "../../types";
import CubeGameRest from "./service/CubeGameRest";

interface Props {
  setCubeID: Dispatch<string>;
}

function CubeSelection(props: Props) {
  const { setCubeID } = props;

  const { profile } = React.useContext(GameContext) as GameContextType;

  const [cubes, setCubes] = useState<ICube[]>([]);
  const [cubeName, setCubeName] = useState<string>("");
  const [cubeFile, setCubeFile] = useState<File | null>(null);

  const loadCubes = () => {
    CubeGameRest.getCubes().then((res) => {
      setCubes(res);
    });
  };

  const onCubeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCubeName(e.target.value);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCubeFile(file);
      if (!cubeName.length) {
        setCubeName(file.name);
      }
    }
  };

  const onSubmitCube = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cubeFile) {
      CubeGameRest.postCubeFromFile(cubeName, cubeFile).then(() => {
        loadCubes();
        setCubeName("");
        setCubeFile(null);
      });
    }
  };

  const onCubeSelectionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCubeID(e.target.value);
  };

  useEffect(loadCubes, []);

  return (
    <div className="mt-5">
      {profile?.room?.iAmAdmin ? (
        <form className="width-20" onSubmit={onSubmitCube}>
          <h4>Cube selection</h4>
          <div onChange={onCubeSelectionChange}>
            {cubes
              && cubes.length > 0
              && cubes.map((cube: ICube) => (
                <div className="form-check" key={cube._id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cube"
                    id={`cube-${cube._id}`}
                    value={cube._id}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`cube-${cube._id}`}
                  >
                    {cube.name}
                  </label>
                </div>
              ))}
          </div>
          <h4 className="mt-3">Load a Cube</h4>
          <input
            type="file"
            className="btn"
            id="load_cube"
            onChange={onFileChange}
          />
          <input
            type="text"
            value={cubeName}
            id="cube_name"
            onChange={onCubeNameChange}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </form>
      ) : (
        <div>The Admin of the room is selecting a cube...</div>
      )}
    </div>
  );
}

export default CubeSelection;
