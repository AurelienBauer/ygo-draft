import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Wrapper from "./component/Wrapper.component";

function Home() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <div className="App-header">
        <p>{t("Home")}</p>
        <Link to="/cube"><button type="button">{t("Cube")}</button></Link>
        <Link to="/booster"><button type="button">{t("Booster opening")}</button></Link>
      </div>
    </Wrapper>
  );
}

export default Home;
