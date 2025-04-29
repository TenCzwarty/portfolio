"use client";

import React from "react";

import { Pill } from "~/components/pill";
import { Section } from "~/components/section";

import { BirthdayCodeModal } from "./_components/birthday-code-modal";

function getTriesText(tries: number) {
  if (tries === 0) return "brak pozostałych prób";
  if (tries === 1) return "pozostała (1) próba";
  if (tries >= 2 && tries <= 4) return `pozostały (${tries}) próby`;

  return `pozostało (${tries}) prób`;
}

export default function BirthdayCode() {
  const [code, setCode] = React.useState(["", "", ""]);

  const [tries, setTries] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tries");
      return saved ? parseInt(saved) : 3;
    }

    return 3;
  });

  const [timeLeft, setTimeLeft] = React.useState("00:00:00:00");
  const [showModal, setShowModal] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");

  const inputRefs = [
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
    React.useRef<HTMLInputElement>(null),
  ];

  React.useEffect(() => {
    const targetDate = new Date();

    targetDate.setHours(targetDate.getHours() + 6);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00:00");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${days.toString().padStart(2, "0")}:${hours
          .toString()
          .padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tries", tries.toString());
    }
  }, [tries]);

  const handleInput = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);

    if (value && idx < 2) {
      inputRefs[idx + 1].current?.focus();
    }

    if (!value && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    }
  };

  const handleReset = () => {
    setCode(["", "", ""]);
    inputRefs[0].current?.focus();
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");

    if (enteredCode === "348") {
      setModalMessage(`kod ${code.join("-")} jest prawidłowy`);
      setIsSuccess(true);
    } else {
      const newTries = tries - 1;
      setTries(newTries);
      setModalMessage(`kod ${code.join("-")} jest nieprawidłowy`);
      setIsSuccess(false);
    }

    setShowModal(true);
  };

  const isCodeComplete = code.every((c) => c.length === 1);

  return (
    <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center">
      <Section>
        <div className="text-center">
          <h2 className="mb-8 text-5xl font-bold text-red-600 sm:text-6xl">
            {timeLeft}
          </h2>
          <h1 className="mb-4 text-xl font-semibold sm:text-3xl">podaj kod</h1>
          <div className="mb-8 flex justify-center gap-4">
            {code.map((val, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                id={`input-code-${idx + 1}`}
                type="text"
                maxLength={1}
                value={val}
                className="aspect-square w-[20%] rounded-xl border bg-white p-4 text-center text-3xl sm:text-8xl"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleInput(idx, e.target.value)}
                disabled={tries < 1}
                autoComplete="off"
                inputMode="numeric"
              />
            ))}
          </div>
          <div className="mb-2 space-x-4">
            <button
              id="button-code-reset"
              className="group"
              onClick={handleReset}
            >
              <Pill classes="bg-primary-900 group-focus:bg-accent-500 hover:bg-accent-500 hover:text-primary-900">
                resetuj
              </Pill>
            </button>
            <button
              className="group"
              onClick={handleSubmit}
              disabled={tries < 1 || !isCodeComplete}
            >
              <Pill classes="bg-primary-900 group-disabled:bg-gray-300 group-disabled:hover:bg-gray-300 group-disabled:hover:text-white group-disabled:hover:cursor-not-allowed group-focus:bg-accent-500 hover:bg-accent-500 hover:text-primary-900">
                testuj
              </Pill>
            </button>
          </div>
          <div>{getTriesText(tries)}</div>
        </div>
      </Section>

      {showModal && (
        <BirthdayCodeModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
          isSuccess={isSuccess}
        />
      )}
    </main>
  );
}
