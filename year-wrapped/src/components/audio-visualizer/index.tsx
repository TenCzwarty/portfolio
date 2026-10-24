"use client";

import React from "react";

import styles from "./styles.module.css";

export const AudioVisualizer = () => {
  React.useEffect(() => {
    const file = document.getElementById("thefile") as HTMLInputElement;
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    let analyser: AnalyserNode;
    let dataArray: Uint8Array;

    const setupAudio = () => {
      const context = new AudioContext();
      const src = context.createMediaElementSource(audio);
      analyser = context.createAnalyser();

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    };

    const setupVisual = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d")!;

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const barWidth = (WIDTH / analyser.frequencyBinCount) * 2.5;

      const renderFrame = () => {
        requestAnimationFrame(renderFrame);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        let x = 0;
        for (let i = 0; i < analyser.frequencyBinCount; i++) {
          const barHeight = dataArray[i];

          const r = barHeight + 25 * (i / analyser.frequencyBinCount);
          const g = 250 * (i / analyser.frequencyBinCount);
          const b = 50;

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      };

      renderFrame();
    };

    file.onchange = function () {
      const files = this.files as FileList;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();

      setupAudio();
      setupVisual();
    };
  }, []);

  return (
    <div id="content">
      <input
        type="file"
        id="thefile"
        accept="audio/*"
        className={styles.file}
      />
      <canvas id="canvas" className={styles.canvas}></canvas>
      <audio id="audio" controls className={styles.audio}></audio>
    </div>
  );
};
