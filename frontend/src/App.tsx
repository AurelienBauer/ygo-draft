import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { ReactNotifications } from "react-notifications-component";
import { createRoot } from "react-dom/client";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Home from "./Home";
import CubeHome from "./Games/Cube/CubeHome.component";
import GameProvider from "./component/Game/GameContext";
import ErrorBoundary from "./component/ErrorBoundary.component";
import ErrorPromiseBoundary from "./component/ErrorPromiseBoundary.component";
import BoosterHome from "./Games/BoosterOpening/BoosterHome.component";

function App() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <DndProvider backend={HTML5Backend}>
      <ErrorBoundary>
        <ReactNotifications />
        <ErrorPromiseBoundary>
          <CookiesProvider>
            <GameProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="cube" element={<CubeHome />} />
                  <Route path="booster" element={<BoosterHome />} />
                </Routes>
              </BrowserRouter>
            </GameProvider>
          </CookiesProvider>
        </ErrorPromiseBoundary>
      </ErrorBoundary>
    </DndProvider>
  );
}

export default createRoot(document.getElementById("root")!).render(<App />);
