"use client";

import { useEffect,useState } from "react";

import { Pill } from "~/components/pill";
import { Section } from "~/components/section";

export default function FunZone() {
  const [code, setCode] = useState<Array<string | null>>([null, null, null]);

  const [tries, setTries] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tries");
      return saved ? parseInt(saved) : 3;
    }
    return -1;
  });

  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const onSubmit = () => {
    if (code.join("") === "348") {
      setModalMessage(`kod ${code.join("-")} jest prawidłowy`);
      setIsSuccess(true);
    } else {
      const newTries = tries - 1;
      setTries(newTries);
      localStorage.setItem("tries", newTries.toString());

      setModalMessage(`kod ${code.join("-")} jest nieprawidłowy`);
      setIsSuccess(false);
    }

    setShowModal(true);
  };

  useEffect(() => {
    const targetDate = new Date("2025-04-26T00:00:00"); // Set your target date here

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("00:00:00:00");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Modal = ({
    message,
    onClose,
  }: {
    message: string;
    onClose: () => void;
  }) => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isSuccess ? "bg-green-600" : "bg-red-600"}`}
    >
      <div className="m-4 rounded-lg bg-white p-8 text-center">
        <p className="mb-8 text-xl">{message}</p>
        {isSuccess ? (
          <>
            <div>51.088736550671335</div>
            <div>17.021036320275783</div>
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

  return (
    <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center">
      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
      <Section>
        <div className="text-center">
          <h2 className="mb-8 text-5xl font-bold text-red-600 sm:text-6xl">
            {timeLeft || "00:00:00:00"}
          </h2>
          <h1 className="mb-4 text-xl font-semibold sm:text-3xl">podaj kod</h1>
          <div className="mb-8 flex justify-center gap-4">
            <input
              id="input-code-1"
              type="text"
              maxLength={1}
              className="aspect-square w-[20%] rounded-xl border bg-white p-4 text-center text-3xl sm:text-8xl"
              onFocus={(e) => e.target?.select()}
              onInput={(e) => {
                const newCode = code;
                newCode[0] = (e.target as HTMLInputElement).value;
                setCode(newCode);

                document.getElementById("input-code-2")?.focus();
              }}
            />
            <input
              id="input-code-2"
              type="text"
              maxLength={1}
              className="aspect-square w-[20%] rounded-xl border bg-white p-4 text-center text-3xl sm:text-8xl"
              onFocus={(e) => e.target?.select()}
              onInput={(e) => {
                const newCode = code;
                newCode[1] = (e.target as HTMLInputElement).value;
                setCode(newCode);

                document.getElementById("input-code-3")?.focus();
              }}
            />
            <input
              id="input-code-3"
              type="text"
              maxLength={1}
              className="aspect-square w-[20%] rounded-xl border bg-white p-4 text-center text-3xl sm:text-8xl"
              onFocus={(e) => e.target.select()}
              onInput={(e) => {
                const newCode = code;
                newCode[2] = (e.target as HTMLInputElement).value;
                setCode(newCode);

                document.getElementById("button-code-reset")?.focus();
              }}
            />
          </div>
          <div className="mb-2 space-x-4">
            <button
              id="button-code-reset"
              className="group"
              onClick={() => {
                const input1 = document.getElementById(
                  "input-code-1",
                ) as HTMLInputElement;
                const input2 = document.getElementById(
                  "input-code-2",
                ) as HTMLInputElement;
                const input3 = document.getElementById(
                  "input-code-3",
                ) as HTMLInputElement;

                input1.value = "";
                input2.value = "";
                input3.value = "";

                setCode([null, null, null]);

                input1.focus();
              }}
            >
              <Pill classes="bg-primary-900 group-focus:bg-accent-500 hover:bg-accent-500 hover:text-primary-900">
                resetuj
              </Pill>
            </button>
            <button
              className="group"
              onClick={onSubmit}
              disabled={
                tries < 1 || !code.reduce((acc, cur) => acc && !!cur, true)
              }
            >
              <Pill classes="bg-primary-900 group-disabled:bg-gray-300 group-disabled:hover:bg-gray-300 group-disabled:hover:text-white group-disabled:hover:cursor-not-allowed group-focus:bg-accent-500 hover:bg-accent-500 hover:text-primary-900">
                testuj
              </Pill>
            </button>
          </div>

          <div>
            {tries === 0 && <p>brak pozostałych prób</p>}
            {tries === 1 && <p>pozostała (1) próba</p>}
            {tries === 2 && <p>pozostały (2) próby</p>}
            {tries === 3 && <p>pozostały (3) próby</p>}
            {tries > 3 && <p>pozostało ({tries}) prób</p>}
          </div>
        </div>
      </Section>
    </main>
  );
}
