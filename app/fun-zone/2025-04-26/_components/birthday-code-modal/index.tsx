import { TBirthdayCodeModal } from "./types";

export const BirthdayCodeModal = ({
  message,
  isSuccess,
  onClose,
}: TBirthdayCodeModal) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center ${isSuccess ? "bg-green-600" : "bg-red-600"}`}
  >
    <div className="m-4 rounded-lg bg-white p-8 text-center">
      <p className="mb-8 text-xl">{message}</p>

      {isSuccess ? (
        <>
          <div>51.08875054483482</div>
          <div>17.02061477997356</div>
          <br />
          <div>572 579 279 / 427 031</div>
        </>
      ) : (
        <button
          onClick={onClose}
          className="bg-primary-900 hover:bg-accent-500 rounded px-4 py-2 text-white"
        >
          zamknij
        </button>
      )}
    </div>
  </div>
);
