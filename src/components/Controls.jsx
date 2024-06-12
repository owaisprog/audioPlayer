import React, { useState } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { usePlayer } from "../Player.context";

const Controls = () => {
  const { pitch, changePitch, isRecording } = usePlayer();
  const { tempo, changeTempo } = usePlayer();

  const increPitch = () => {
    const value = Number(parseFloat(pitch + 0.05).toFixed(2));
    changePitch(value);
  };
  const decrePitch = () => {
    const value = Number(parseFloat(pitch - 0.05).toFixed(2));
    changePitch(value);
  };
  const increasePitch = () =>
    parseFloat(pitch).toFixed(2) >= 1.5 ? changePitch(1.5) : increPitch();
  const decreasePitch = () =>
    parseFloat(pitch).toFixed(2) <= 0.75 ? changePitch(0.75) : decrePitch();
  const increSpeed = () => {
    const value = Number(parseFloat(tempo + 0.05).toFixed(2));
    changeTempo(value);
  };
  const decreSpeed = () => {
    const value = Number(parseFloat(tempo - 0.05).toFixed(2));
    changeTempo(value);
  };
  const increaseSpeed = () =>
    parseFloat(tempo).toFixed(2) >= 1.5 ? changeTempo(1.5) : increSpeed();
  const decreaseSpeed = () =>
    parseFloat(tempo).toFixed(2) <= 0.5 ? changeTempo(0.5) : decreSpeed();
  // Function to map the value from the range of 0.75-1.50 to -6 to 6
  const mapPitchToDisplay = (pitch) => {
    return Math.round((pitch - 1) * 16);
  };
  // Function to map the tempo value from the range of 0.5-1.5 to -6 to 6
  const mapSpeedToDisplay = (speed) => {
    return Math.round((speed - 1) * 12);
  };
  // Function to format the display value with a plus or minus sign
  const formatDisplayValue = (value) => {
    return value > 0 ? `+${value}` : `${value}`;
  };
  // Mapped display values
  const pitchDisplayValue = formatDisplayValue(mapPitchToDisplay(pitch));
  const speedDisplayValue = formatDisplayValue(mapSpeedToDisplay(tempo));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
      <div className="bg-[#abc481] p-4 rounded-lg">
        <h3 className="font-medium text-2xl md:text-4xl text-black">
          Altezza: <span id="pitchValue">{pitchDisplayValue}</span>
        </h3>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            disabled={isRecording}
            onClick={increasePitch}
            className={` bg-no-repeat bg-contain w-56 h-16 md:h-24 opacity-100`}
            style={{ backgroundImage: "url('elementi/Risorsa 8-8.png')" }}
          ></button>
          <button
            disabled={isRecording}
            onClick={decreasePitch}
            className={` bg-no-repeat bg-contain w-56 h-16 md:h-24 opacity-100`}
            style={{ backgroundImage: "url('elementi/Risorsa 9-8.png')" }}
          ></button>
        </div>
      </div>
      <div className="bg-[#ffde94] p-4 rounded-lg">
        <h3 className="font-medium text-2xl md:text-4xl text-black">
          Velocità: <span id="speedDisplay">{speedDisplayValue}</span>
        </h3>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            disabled={isRecording}
            onClick={increaseSpeed}
            className={` bg-no-repeat bg-contain w-56 h-16 lg:h-24 opacity-100`}
            style={{ backgroundImage: "url('elementi/Risorsa 10-8.png')" }}
          ></button>
          <button
            disabled={isRecording}
            onClick={decreaseSpeed}
            className={` bg-no-repeat bg-contain w-56 h-16 lg:h-24 opacity-100`}
            style={{ backgroundImage: "url('elementi/Risorsa 11-8.png')" }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
