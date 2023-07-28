import React, {useState} from 'react';
import './App.css';
import {useParams} from "react-router-dom";
import BoosterGamePlayer from "./BoosterGamePlayer";

const BoosterGame = () => {
    const {id} = useParams();

    const [player, setPlayer] = useState(0);

    const handlePlayerSwitch = (p) => {
        setPlayer(p);
    }

    return (
        <div className="App">
            <a href="/boosters">Return</a>
            {/*<button onClick={() => handlePlayerSwitch(0)}>player 1</button>
            <button onClick={() => handlePlayerSwitch(1)}>player 2</button>
            {player === 0 ? <h2>LOIC</h2> : <h2>AURÉ</h2>}
            {player === 0 ? <BoosterGamePlayer id={id}/> : <BoosterGamePlayer id={id}/>}*/}
            <BoosterGamePlayer id={id}/>
        </div>
    )
}

export default BoosterGame;