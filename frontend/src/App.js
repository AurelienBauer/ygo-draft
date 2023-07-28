import React from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CubeHome from "./Games/Cube/CubeHome.component";
import { CookiesProvider } from "react-cookie";
import GameProvider from "./component/Game/GameContext";
import ErrorBoundary from "./component/ErrorBoundary.component";
import ErrorPromiseBoundary from "./component/ErrorPromiseBoundary.component";
import { ReactNotifications } from "react-notifications-component";

const test = {};

const App = () => {
  return (
    <ErrorBoundary>
      <ReactNotifications />
      <ErrorPromiseBoundary>
        <CookiesProvider>
          <GameProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="cube" element={<CubeHome />} />
              </Routes>
            </BrowserRouter>
          </GameProvider>
        </CookiesProvider>
      </ErrorPromiseBoundary>
    </ErrorBoundary>
  );
};

export default createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
