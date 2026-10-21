import { Slide, toast as reactToast, ToastContainer as ReactToastContainer } from "react-toastify";

const className = "rounded-xl border text-start text-sm border-primary-800 pr-8!";

type TToastOptions = {
  /** adds an "undo" button that runs this and closes the toast */
  undo?: () => void;
};

export const toast = (message: string, { undo }: TToastOptions = {}) =>
  undo
    ? reactToast(
        ({ closeToast }) => (
          <div className="flex w-full items-center justify-between gap-4">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => {
                undo();
                closeToast();
              }}
              className="font-semibold underline hover:no-underline"
            >
              undo
            </button>
          </div>
        ),
        { className }
      )
    : reactToast(message, { className });

export const ToastContainer = () => <ReactToastContainer transition={Slide} />;
