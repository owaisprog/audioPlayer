import React, { useState } from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Loader from "./Loader";
import { usePlayer } from "../Player.context";

const AudioPlayer = () => {
  const { loadFile, isRecording, setIsDModal, recordAudio, recordedFile } =
    usePlayer();
  const { playHead, duration, progress, resetPlayHead } = usePlayer();
  const { resetbtn, shifter, loading, playing, play, pause } = usePlayer();
  const { volume, changeVolume, toggleMute, isMute, pitch, tempo } =
    usePlayer();
  const [isVHover, setIsVHover] = useState(false);
  const onClick = ({ target, pageX }) => {
    if (duration !== "0:00") {
      const pos = target.getBoundingClientRect();
      const relX = pageX - pos.x;
      const perc = relX / target.offsetWidth;
      resetPlayHead(perc);
    }
  };
  const onChange = ({
    target: {
      files: [file],
      value,
    },
  }) => {
    const fileTest = /(.mp3)$/i.test(value);
    if (fileTest) {
      loadFile(file);
    } else {
      window.alert("you can only load an mp3 file");
    }
  };
  return (
    <div className="container my-4 mx-auto p-4">
      {/* Replace this condition with a loading state check */}
      <div className="my-4 bg-[#a374b3] relative p-4 rounded-full ">
        <div className="bg-[#d3c0d9] rounded-full p-4 text-[#58465f] flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <button className="mr-4">
              {playing ? (
                <FaPause onClick={pause} color="#84748c" size="1.5em" />
              ) : (
                <FaPlay
                  disabled={!shifter || loading}
                  onClick={play}
                  color="#84748c"
                  size="1.5em"
                />
              )}
            </button>
            <span className="font-bold">{playHead}</span> /{" "}
            <span className="font-bold">{duration}</span>
          </div>
          <progress
            id="progressMeter"
            value={progress}
            max="100"
            onClick={onClick}
            className="w-full sm:w-[80%] rounded-full bg-[#baa6c0] h-[6px] mx-4"
          ></progress>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <button onMouseLeave={() => setIsVHover(false)} disabled={!shifter}>
              {isMute ? (
                <FaVolumeMute
                  onClick={toggleMute}
                  color="#84748c"
                  size="1.5em"
                />
              ) : (
                <div className="relative flex items-center gap-2 justify-center">
                  {/* Replace this condition with a volume control state check */}
                  {isVHover && (
                    <div>
                      <input
                        onChange={changeVolume}
                        type="range"
                        autoFocus
                        min="0.0"
                        max="10.0"
                        name="volumeSlider"
                        value={volume}
                        className="volume-slider"
                        id="volumeSlider"
                        step="0.01"
                        list="volumerange"
                      />
                      <datalist id="volumerange">
                        <option value="0.1" label="0" />
                        <option value="0.3" />
                        <option value="0.5" />
                        <option value="0.7" />
                        <option value="0.9" label="2" />
                        <option value="1.1" />
                        <option value="1.3" />
                        <option value="1.5" />
                        <option value="1.7" label="4" />
                        <option value="1.9" />
                      </datalist>
                    </div>
                  )}
                  <FaVolumeUp
                    onMouseEnter={() => setIsVHover(true)}
                    onClick={toggleMute}
                    color="#84748c"
                    size="1.5em"
                  />
                  <style>
                    {`
    .volume-slider {
      width: 5rem;
      background: transparent;
      -webkit-appearance: none;
      writing-mode: bt-lr;
    }
    
    .volume-slider::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      animate: 0.2s;
      background: #84748c;
      border-radius: 20px;
    }
    
    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #84748c;
      cursor: pointer;
      margin-top: -4px;
    }
    
    .volume-slider:focus::-webkit-slider-runnable-track {
      background: #84748c;
    }
    
    .volume-slider::-moz-range-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 1px 1px 1px #000000;
      background: #84748c;
      border-radius: 50%;
    }
    
    .volume-slider::-moz-range-thumb {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #84748c;
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000;
    }
    
    .volume-slider::-ms-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    
    .volume-slider::-ms-fill-lower {
      background: #84748c;
      border-radius: 2.6px;
    }
    
    .volume-slider::-ms-fill-upper {
      background: #84748c;
      border-radius: 2.6px;
    }
    
    .volume-slider::-ms-thumb {
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #84748c;
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000;
    }
    
    .volume-slider:focus::-ms-fill-lower {
      background: #84748c;
    }
    
    .volume-slider:focus::-ms-fill-upper {
      background: #84748c;
    }
    `}
                  </style>
                </div>
              )}
            </button>
          </div>
        </div>
        {(!shifter || isRecording) && (
          <div className=" absolute left-0 top-0 right-0 bottom-0 bg-white opacity-30"></div>
        )}
      </div>
      <div className="container mx-auto flex mt-6 flex-col md:flex-row gap-8 justify-center items-center">
        <label
          htmlFor="audioFile"
          className={`bg-no-repeat ${
            (recordedFile || isRecording) && " opacity-50"
          } bg-contain w-40 h-16 cursor-pointer`}
          style={{ backgroundImage: "url('/elementi/Risorsa 5-8.png')" }}
        ></label>
        <input
          onChange={onChange}
          type="file"
          id="audioFile"
          accept="audio/*"
          disabled={recordedFile || isRecording}
          className="hidden"
        />
        {!playing ? (
          <button
            id="playBtn"
            onClick={play}
            disabled={!shifter || isRecording || recordedFile}
            className={`${
              (!shifter || isRecording || recordedFile) && " opacity-50"
            } bg-no-repeat bg-contain w-40 h-16`}
            style={{
              backgroundImage: "url('elementi/Risorsa 14-8.png')",
            }}
          ></button>
        ) : (
          <button
            id="pausebtn"
            onClick={pause}
            disabled={!shifter || isRecording || recordedFile}
            className={`${
              (!shifter || isRecording || recordedFile) && " opacity-50"
            }  bg-no-repeat bg-contain w-40 h-16`}
            style={{
              backgroundImage: "url('elementi/Risorsa 15-8.png')",
            }}
          ></button>
        )}
        <button
          id="recordedbtn"
          disabled={
            !shifter ||
            (pitch === 1.0 && tempo === 1.0) ||
            isRecording ||
            recordedFile
          }
          onClick={recordAudio}
          className={`${
            (!shifter ||
              (pitch === 1.0 && tempo === 1.0) ||
              isRecording ||
              recordedFile) &&
            " opacity-50"
          } bg-no-repeat bg-contain w-40 h-16`}
          style={{ backgroundImage: "url('elementi/Risorsa 6-8.png')" }}
        ></button>
        <button
          id="downloadbtn"
          disabled={!recordAudio}
          onClick={() => setIsDModal(true)}
          className={`${
            !recordedFile && " opacity-50"
          } bg-no-repeat bg-contain w-40 h-16 opacity-100`}
          style={{ backgroundImage: "url('elementi/Risorsa 16-8.png')" }}
        ></button>
        <button
          id="resetbtn"
          disabled={!shifter}
          onClick={resetbtn}
          className={` bg-no-repeat bg-contain ${
            !recordedFile && " opacity-50"
          } opacity-100 w-40 h-16`}
          style={{ backgroundImage: "url('elementi/Risorsa 16-9.png')" }}
        ></button>
      </div>
      {!shifter && (
        <Loader text={"Iniziamo! Carica un file audio"} loader={false} />
      )}
      {shifter && !isRecording && !recordedFile && (
        <Loader
          text={"File caricato! Modificalo e poi registra le modifiche"}
          loader={false}
        />
      )}
      {isRecording && (
        <Loader
          // text={"File caricato! Modificalo e poi registra le modifiche"}
          loader={true}
        />
      )}
      {recordedFile && (
        <Loader
          text={"Fatto! Puoi scaricare il file modificato"}
          loader={false}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
