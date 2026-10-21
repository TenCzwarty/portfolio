import React from "react";

type TModal = {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
};

/** Same frame as the project modal on /portfolio, but only as tall as its content. */
export const Modal = ({ title, onClose, children }: TModal) => {
  // the page behind stays put: scrolling happens inside the modal only
  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed top-0 right-0 z-30 mt-0! flex h-full w-full items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-modal-title"
    >
      <div className="absolute top-0 right-0 z-0 h-full w-full bg-black/30" onClick={onClose} />
      <div className="border-primary-800 text-primary-900 relative mx-auto max-h-full w-full overflow-auto overscroll-contain rounded-xl border bg-neutral-100 p-4 md:w-[calc(200dvw/3)]">
        <div className="flex items-start justify-between gap-4">
          <h3 id="plan-modal-title" className="text-lg font-semibold break-words sm:text-xl">
            {title}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close modal" className="p-2">
            close
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base">{children}</div>
      </div>
    </div>
  );
};
