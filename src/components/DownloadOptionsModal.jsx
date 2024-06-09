import {
  Button,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { saveAs } from "file-saver";
import { usePlayer } from "../Player.context";

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

  const downloadAudioInMP3 = async () => {
    if (recordedFile) {
      if (recordedFile.size > 0) {
        try {
          // Save the MP3 file
          saveAs(recordedFile, `${audioFileName}_adtta.mp3`);
          setIsDModal(!isDModal);
        } catch (error) {
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
