import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useRef,
} from "react";
import RecordRTC from "recordrtc";
import { PitchShifter } from "soundtouchjs";
export const PlayerContext = createContext();

export const PlayerProvider = ({ audioCtx, gainNode, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [tempo, setTempo] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [semitone, setSemitone] = useState(0);
  const [volume, setVolume] = useState(1.1);
  const [playHead, setPlayHead] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const [shifter, setShifter] = useState();
  const [isDModal, setIsDModal] = useState(false);
  const [recordedFile, setRecordedFile] = useState(false);
  const [audioFileName, setAudioFileName] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const value = useMemo(
    () => ({
      loading,
      setLoading,
      playing,
      setPlaying,
      isDModal,
      setIsDModal,
      recordedFile,
      setRecordedFile,
      audioFileName,
      setAudioFileName,
      isRecording,
      setIsRecording,
      isMute,
      setIsMute,
      tempo,
      setTempo,
      pitch,
      setPitch,
      semitone,
      setSemitone,
      volume,
      setVolume,
      playHead,
      setPlayHead,
      duration,
      setDuration,
      progress,
      setProgress,
      audioCtx,
      gainNode,
      shifter,
      setShifter,
    }),
    [
      loading,
      setLoading,
      playing,
      setPlaying,
      isMute,
      setIsMute,
      isDModal,
      setIsDModal,
      recordedFile,
      setRecordedFile,
      audioFileName,
      setAudioFileName,
      isRecording,
      setIsRecording,
      tempo,
      setTempo,
      pitch,
      setPitch,
      semitone,
      setSemitone,
      volume,
      setVolume,
      playHead,
      setPlayHead,
      duration,
      setDuration,
      progress,
      setProgress,
      audioCtx,
      gainNode,
      shifter,
      setShifter,
    ]
  );

  return <PlayerContext.Provider value={value} {...props} />;
};

export const usePlayer = () => {
  const {
    loading,
    setLoading,
    playing,
    setPlaying,
    isMute,
    setIsMute,
    isDModal,
    setIsDModal,
    recordedFile,
    setRecordedFile,
    audioFileName,
    setAudioFileName,
    isRecording,
    setIsRecording,
    tempo,
    setTempo,
    pitch,
    setPitch,
    semitone,
    setSemitone,
    volume,
    setVolume,
    playHead,
    setPlayHead,
    duration,
    setDuration,
    progress,
    setProgress,
    audioCtx,
    gainNode,
    shifter,
    setShifter,
  } = useContext(PlayerContext);
  const mediaRecorderRef = useRef(null);
  const recorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const playbackGainNodeRef = useRef(audioCtx.createGain());
  const recordingGainNodeRef = useRef(audioCtx.createGain());
  const onPlay = ({ formattedTimePlayed, percentagePlayed }) => {
    setPlayHead(formattedTimePlayed);
    setProgress(percentagePlayed);
    if (Math.round(percentagePlayed) === 100) {
      pauseAudio();
      setPlaying(false);
      setPlayHead("0:00");
      resetPlayHead(0); // Reset playhead to the start when audio completes
    }
  };

  const newShifter = (buffer) => {
    const myShifter = new PitchShifter(audioCtx, buffer, 16384);
    myShifter.tempo = tempo;
    myShifter.pitch = pitch;
    myShifter.on("play", onPlay);
    setDuration(myShifter.formattedDuration);
    setShifter(myShifter);
    setLoading(false);
  };

  const onLoad = ({ target: { result: buffer } }) => {
    if (shifter) {
      shifter.off();
    }
    if (buffer) {
      audioCtx.decodeAudioData(buffer).then((audioBuffer) => {
        newShifter(audioBuffer);
      });
    }
  };

  const loadFile = (file) => {
    setLoading(true);
    const fileName = file?.name.split(".").slice(0, -1).join(".");
    if (shifter) {
      setPlayHead("0:00");
      setProgress(0);
      pauseAudio();
    }
    setAudioFileName(fileName);
    const fileReader = new FileReader();
    fileReader.onload = onLoad;
    try {
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      alert(err);
    }
  };

  const playAudio = () => {
    if (shifter) {
      if (Math.round(shifter.percentagePlayed) === 100) {
        shifter.percentagePlayed = 0; // Reset shifter's position to the start
        setProgress(0);
      }
      setPlaying(true);
      shifter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      audioCtx.resume();
    }
  };

  const pauseAudio = () => {
    if (shifter) {
      shifter.disconnect();
      setPlaying(false);
    }
  };

  const resetPlayHead = (perc) => {
    if (shifter) {
      shifter.percentagePlayed = perc;
      setPlayHead(shifter.formattedTimePlayed);
    }
    setProgress(100 * perc);
  };
  const resetbtn = () => {
    if (recordedFile) {
      window.location.reload();
    } else {
      setPitch(1.0);
      setTempo(1.0);
    }
  };
  // const recordAudio = async () => {
  //   setIsRecording(true);
  //   setPlaying(false);
  //   pauseAudio();
  //   shifter.percentagePlayed = 0; // Reset shifter's position to the start
  //   setProgress(0);
  //   setPlayHead("0:00");
  //   // Set up MediaRecorder to record the audio
  //   const destination = audioCtx.createMediaStreamDestination();
  //   gainNode.connect(destination);

  //   mediaRecorderRef.current = new MediaRecorder(destination.stream);
  //   mediaRecorderRef.current.ondataavailable = (event) => {
  //     if (event.data.size > 0) {
  //       audioChunksRef.current.push(event.data);
  //     }
  //   };
  //   mediaRecorderRef.current.onstop = () => {
  //     const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
  //     setRecordedFile(blob);
  //     audioChunksRef.current = [];
  //   };

  //   setPlaying(true);
  //   shifter.connect(gainNode);
  //   gainNode.connect(audioCtx.destination);
  //   audioCtx.resume();

  //   setTimeout(() => {
  //     mediaRecorderRef.current.start();
  //   }, 1000);
  //   // Check shifter.percentagePlayed every second
  //   const intervalId = setInterval(async () => {
  //     if (Math.round(shifter.percentagePlayed) === 100) {
  //       clearInterval(intervalId); // Stop checking once condition is met
  //       pauseAudio();
  //       setProgress(0);
  //       setPlayHead("0:00");
  //       stopAudioRecording();
  //     }
  //   }, 500); // Check every 1000 ms (1 second)
  // };

  const recordAudio = () => {
    setIsRecording(true);
    setPlaying(false);
    pauseAudio();
    shifter.percentagePlayed = 0; // Reset shifter's position to the start
    setProgress(0);
    setPlayHead("0:00");

    const destination = audioCtx.createMediaStreamDestination();
    gainNode.connect(destination);

    recorderRef.current = RecordRTC(destination.stream, {
      type: "audio",
      mimeType: "audio/wav",
      recorderType: RecordRTC.StereoAudioRecorder,
      desiredSampRate: 16000,
    });

    setPlaying(true);
    shifter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    audioCtx.resume();
    setTimeout(() => {
      recorderRef.current.startRecording();
    }, 1000);
    // Check shifter.percentagePlayed every second
    const intervalId = setInterval(() => {
      if (Math.round(shifter.percentagePlayed) === 100) {
        clearInterval(intervalId); // Stop checking once condition is met
        pauseAudio();
        setProgress(0);
        setPlayHead("0:00");
        stopAudioRecording();
      }
    }, 500); // Check every 500 ms (0.5 second)
  };

  // const stopAudioRecording = async () => {
  //   setIsRecording(false);
  //   if (mediaRecorderRef.current) {
  //     mediaRecorderRef.current.stop();
  //   }
  // };
  const stopAudioRecording = async () => {
    setIsRecording(false);
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setRecordedFile(blob);
      });
    }
  };
  const toggleMute = () => {
    if (gainNode) {
      if (isMute) {
        gainNode.gain.value = volume;
      } else {
        gainNode.gain.value = 0;
      }
      setIsMute(!isMute);
    }
  };

  return {
    loading,
    playing,
    isMute,
    isDModal,
    setIsDModal,
    recordedFile,
    audioFileName,
    isRecording,
    duration,
    tempo,
    pitch,
    semitone,
    volume,
    playHead,
    progress,
    loadFile,
    play: playAudio,
    pause: pauseAudio,
    toggleMute,
    resetbtn,
    recordAudio,
    changeVolume: ({ target: { value } }) => {
      setVolume(value);
      gainNode.gain.value = value;
      if (isMute) {
        toggleMute();
      }
    },
    changeSemitone: ({ target: { value } }) => {
      setSemitone(value);
      if (shifter) {
        shifter.pitchSemitones = value;
      }
    },
    changePitch: (value) => {
      setPitch(value);
      if (shifter) {
        shifter.pitch = value;
      }
    },
    changeTempo: (value) => {
      setTempo(value);
      if (shifter) {
        shifter.tempo = value;
      }
    },
    resetPlayHead,
    shifter,
  };
};
