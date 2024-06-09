import React from "react";
import { PlayerProvider } from "./Player.context";
import Player from "./components/Player.component";
import Header from "./components/Header";
import DownloadOptionsModal from "./components/DownloadOptionsModal";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioCtx.createGain();

export default function App() {
  return (
    <div className="App">
      <Header />
      <PlayerProvider {...{ audioCtx, gainNode }}>
        <Player />
        <DownloadOptionsModal/>
      </PlayerProvider>
    </div>
  );
}
