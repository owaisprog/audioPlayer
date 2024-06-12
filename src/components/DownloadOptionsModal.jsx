import {
  Button,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { saveAs } from "file-saver";
import { usePlayer } from "../Player.context";
import lamejs from "lamejs";
export default function DownloadOptionsModal() {
  const { recordedFile, isDModal, setIsDModal, audioFileName } = usePlayer();
  const downloadAudioInWAV = async () => {
    if (recordedFile) {
      if (recordedFile.size > 0) {
        saveAs(recordedFile, `${audioFileName}_adtta.wav`);
        setIsDModal(!isDModal);
      } else {
        console.error("Recorded file is empty or corrupted");
      }
    }
  };
  const convertToMP3 = async (wavBlob) => {
    console.log(wavBlob);
    // Alternative method to read Blob as ArrayBuffer using FileReader
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(wavBlob);
      console.log(reader);
    });
    console.log(arrayBuffer);
    const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
    const samples = new Int16Array(
      arrayBuffer,
      wav.dataOffset,
      wav.dataLen / 2
    );

    const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 128);
    const mp3Data = [];
    const sampleBlockSize = 1152;

    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const sampleChunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    const mp3buf = mp3Encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    const blob = new Blob(mp3Data, { type: "audio/mp3" });
    return blob;
  };
  const downloadAudioInMP3 = async () => {
    if (recordedFile) {
      if (recordedFile.size > 0) {
        try {
          // Save the MP3 file
          const blob = await convertToMP3(recordedFile);
          saveAs(blob, `${audioFileName}_adtta.mp3`);
          setIsDModal(!isDModal);
        } catch (error) {
          console.log(error);
          console.error("Error downloading MP3:", error);
        }
      } else {
        console.error("Recorded file is empty or corrupted");
      }
    }
  };

  return (
    <>
      <Transition appear show={isDModal}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => setIsDModal(!isDModal)}
          __demoMode
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center bg-black opacity-80 justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md flex items-center flex-col justify-center gap-3 rounded-xl p-6">
                  <button
                    style={{
                      opacity: 1,
                    }}
                    onClick={downloadAudioInMP3}
                    className="bg-[#000] border border-white hover:bg-white hover:text-black transition-all duration-1000 px-6 py-3 rounded-lg text-white font-medium"
                  >
                    Download in MP3
                  </button>
                  <button
                    onClick={downloadAudioInWAV}
                    className="bg-[#000] border border-white hover:bg-white hover:text-black transition-all duration-1000 px-6 py-3 rounded-lg text-white font-medium"
                  >
                    Download in Wav
                  </button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
