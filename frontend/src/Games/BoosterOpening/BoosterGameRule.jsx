import React, { useEffect, useState } from "react";
import "./App.css";
import { getBoosters, postBoosterGameRule } from "./api";

const BoosterGameRule = () => {
  const [boostersList, setBoosterList] = useState([]);
  const [isSave, setIsSave] = useState(false);
  const [name, setName] = useState("");
  const [playerNumber, setPlayerNumber] = useState(0);
  const [booster, setBooster] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();

    postBoosterGameRule({
      name,
      player_number: playerNumber,
      boosters: Object.keys(booster).map((key) => ({
        booster_id: key,
        quantity: booster[key],
      })),
    }).then((result) => {
      if (!result.id) {
        alert("An error occur :/");
      } else {
        setIsSave(true);
        console.dir(result.id);
      }
    });
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlePlayerNumber = (e) => {
    setPlayerNumber(e.target.value);
  };

  const handleBooster = (e, id) => {
    const copy = { ...booster };
    copy[id] = e.target.value;
    setBooster(copy);
  };

  useEffect(() => {
    getBoosters().then((res) => {
      setBoosterList(res);
    });
  }, []);

  return (
    <div className="App">
      <a href="/boosters">Return</a>
      <form className="App-header" onSubmit={onSubmit}>
        <ul>
          <li>
            Name: <input type="text" value={name} onChange={handleName} />
          </li>
          <li>
            PlayerNumber:{" "}
            <input
              type="number"
              value={playerNumber}
              onChange={handlePlayerNumber}
            />
          </li>
        </ul>
        Booster selection
        <ul>
          {boostersList.map((booster, i) => (
            <li key={i}>
              {booster.name_fr}
              <img src={booster.image_src} alt={booster.name} />
              Number:{" "}
              <input
                type="number"
                onChange={(e) => handleBooster(e, booster._id)}
              />
            </li>
          ))}
        </ul>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default BoosterGameRule;
