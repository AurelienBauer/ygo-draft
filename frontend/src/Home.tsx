import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import {
  VerticalRotateListGroup,
  VerticalRotateListItem,
} from "./frontendComponent/VerticalRotateList.component";
import Wrapper from "./component/Wrapper.component";

const Home = () => {
  return (
    <Wrapper>
      <div className="App-header">
        <p>Home</p>
        <Link to="/booster">
          <button type="button">Booster</button>
        </Link>
        <Link to="/cube">Cubes</Link>
        <VerticalRotateListGroup
          value="Loic"
          config={{
            visibleItem: 3,
          }}
        >
          <VerticalRotateListItem value={"Aurelien"} text={"Aurelien"} />
          <VerticalRotateListItem value={"Loic"} text={"Loic"} />
          <VerticalRotateListItem value={"Fanny"} text={"Fanny"} />
          <VerticalRotateListItem value={"Toune"} text={"Toune"} />
          <VerticalRotateListItem value={"Valentin"} text={"Valentin"} />
        </VerticalRotateListGroup>
      </div>
    </Wrapper>
  );
};

export default Home;
