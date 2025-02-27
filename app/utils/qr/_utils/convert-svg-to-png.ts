import { createSVGUrl } from "~qr/_utils/create-svg-url";

type Props = {
  svgString: string;
};

type ReturnType = Promise<string | null>;

export const convertSVGToPNG = ({ svgString }: Props): ReturnType =>
  new Promise((resolve) => {
    const url = createSVGUrl({ svgString });

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;

      const context = canvas.getContext("2d");

      if (!context) return;

      context.fillStyle = "transparent";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      resolve(canvas.toDataURL("image/png"));
    };

    img.src = url;
  });
