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
  const [audioFile, setAudioFile] = useState(null);
  const [pitch, setPitch] = useState(1.0);
  const [semitone, setSemitone] = useState(0);
  const [volume, setVolume] = useState(1.1);
  const [playHead, setPlayHead] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const [shifter, setShifter] = useState();
  const [isDModal, setIsDModal] = useState(false);
  const [recordedFile, setRecordedFile] = useState(false);
  const [recordedWAVFile, setRecordedWAVFile] = useState(false);
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
      recordedWAVFile,
      setRecordedWAVFile,
      audioFileName,
      setAudioFileName,
      isRecording,
      audioFile,
      setAudioFile,
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
      audioFile,
      setAudioFile,
      audioFileName,
      setAudioFileName,
      recordedWAVFile,
      setRecordedWAVFile,
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
    audioFile,
    setAudioFile,
    recordedFile,
    recordedWAVFile,
    setRecordedWAVFile,
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
  const recorderMP3Ref = useRef(null);
  const recorderWAVRef = useRef(null);
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
    setAudioFile(file);
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
  const recordAudio = () => {
    setIsRecording(true);
    pauseAudio();
    shifter.percentagePlayed = 0; // Reset shifter's position to the start
    playAudio()
    setProgress(0);
    setPlayHead("0:00");
    shifter.off()
    const fileReader = new FileReader();
    fileReader.onload = onLoad;
    try {
      fileReader.readAsArrayBuffer(audioFile);
    } catch (err) {
      alert(err);
    }
    setTimeout(() => {
      const destination = audioCtx.createMediaStreamDestination();
      gainNode.connect(destination);

      recorderWAVRef.current = RecordRTC(destination.stream, {
        type: "audio",
        mimeType: "audio/wav",
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
      });
      recorderMP3Ref.current = RecordRTC(destination.stream, {
        type: "audio",
        mimeType: "audio/mp3",
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
      });

      playAudio();
      recorderMP3Ref.current.startRecording();
      recorderWAVRef.current.startRecording();
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
    }, 2000);
  };

  const stopAudioRecording = async () => {
    setIsRecording(false);
    if (recorderMP3Ref.current) {
      recorderMP3Ref.current.stopRecording(() => {
        const blob = recorderMP3Ref.current.getBlob();
        setRecordedFile(blob);
      });
    }
    if (recorderWAVRef.current) {
      recorderWAVRef.current.stopRecording(() => {
        const blob = recorderWAVRef.current.getBlob();
        setRecordedWAVFile(blob);
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
    recordedWAVFile,
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
