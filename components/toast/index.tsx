import {
  Slide,
  toast as reactToast,
  ToastContainer as ReactToastContainer,
} from "react-toastify";

export const toast = (message: string) =>
  reactToast(message, {
    className: "rounded-xl border text-start text-sm border-primary-800 pr-8!",
  });

export const ToastContainer = () => <ReactToastContainer transition={Slide} />;
