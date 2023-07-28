import React, {useEffect, useState} from 'react';
import './App.css';
import {Link} from "react-router-dom";
import {getGameRules} from "./api";

const BoosterHome = () => {

    const [gameRules, setGameRules] = useState([]);

    useEffect(() => {
        getGameRules().then((result) => {
            setGameRules(result);
        })
    }, []);

    return (
        <div className="App">
            <a href="/">Home</a>
            <div className="App-header">
                <ul>
                    {gameRules.map((gameRule) =>
                        <li key={gameRule._id}>
                            <a href={`/boosters/${gameRule._id}`}>{gameRule.name} ({gameRule.player_number} players)</a>
                        </li>
                    )}
                </ul>
                <Link to="/boosterGameRules">
                    <button type="button">New Booster Game rules</button>
                </Link>
            </div>
        </div>
    );
}

export default BoosterHome;