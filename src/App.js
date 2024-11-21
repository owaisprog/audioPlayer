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

        <h2 className="text-center font-semibold mb-10">Questa comoda webapp ad accesso libero, messa a disposizione da Loescher e D’Anna Editori, non richiede installazione e ti permette <br /> di personalizzare tonalità e/o velocità di file mp3 e wav in pochi secondi, per poi scaricarli offline</h2>
        <DownloadOptionsModal />
      </PlayerProvider>
    </div>
  );
}
