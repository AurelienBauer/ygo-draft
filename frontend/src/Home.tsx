import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import Wrapper from "./component/Wrapper.component";

function Home() {
  return (
    <Wrapper>
      <div className="App-header">
        <p>Home</p>
        <Link to="/cube"><button type="button">Cube</button></Link>
      </div>
    </Wrapper>
  );
}

export default Home;
