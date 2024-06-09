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
    parseFloat(pitch).toFixed(2) >= 1.50 ? changePitch(1.50) : increPitch();
  const decreasePitch = () =>
    parseFloat(pitch).toFixed(2) <= 0.75 ? changePitch(0.75) : decrePitch();
  const increSpeed = () => {
    const value = Number(parseFloat(tempo + 0.15).toFixed(2));
    changeTempo(value);
  };
  const decreSpeed = () => {
    const value = Number(parseFloat(tempo - 0.15).toFixed(2));
    changeTempo(value);
  };
  const increaseSpeed = () =>
    parseFloat(tempo).toFixed(2) >= 1.50 ? changeTempo(1.50) : increSpeed();
  const decreaseSpeed = () =>
    parseFloat(tempo).toFixed(2) <= 0.50 ? changeTempo(0.50) : decreSpeed();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
      <div className="bg-[#abc481] p-4 rounded-lg">
        <h3 className="font-bold text-black">
          Pitch:{" "}
          <span id="pitchValue">{parseFloat(pitch).toFixed(2)} semitones</span>
        </h3>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            disabled={isRecording}
            onClick={increasePitch}
            className="flex items-center bg-[#94ac64] text-white p-2 rounded-lg"
          >
            Increase Pitch
            <FaPlusCircle className="ml-2" size={40} />
          </button>
          <button
            disabled={isRecording}
            onClick={decreasePitch}
            className="flex items-center bg-[#94ac64] text-white p-2 rounded-lg"
          >
            Decrease Pitch
            <FaMinusCircle className="ml-2" size={40} />
          </button>
        </div>
      </div>
      <div className="bg-[#ffde94] p-4 rounded-lg">
        <h3 className="font-bold text-black">
          Speed: <span id="speedDisplay">{parseFloat(tempo).toFixed(2)}x</span>
        </h3>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            disabled={isRecording}
            onClick={increaseSpeed}
            className="flex items-center bg-[#d4b364] text-white p-2 rounded-lg"
          >
            Increase Speed
            <FaPlusCircle className="ml-2" size={40} />
          </button>
          <button
            disabled={isRecording}
            onClick={decreaseSpeed}
            className="flex items-center bg-[#d4b364] text-white p-2 rounded-lg"
          >
            Decrease Speed
            <FaMinusCircle className="ml-2" size={40} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
