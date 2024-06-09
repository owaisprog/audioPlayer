import React from "react";
import Controls from "./Controls";
import AudioPlayer from "./AudioPlayer";
const Player = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mt-8 text-center">
        <AudioPlayer />
      </div>
      <div className="container mx-auto p-4">
        <Controls />
      </div>
    </div>
  );
};

export default Player;
