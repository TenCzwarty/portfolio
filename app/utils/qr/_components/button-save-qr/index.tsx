import { SaveIcon } from "lucide-react";
import React from "react";

import { useQRCodeGeneratorContext } from "~/app/utils/qr/_context";
import { Pill } from "~/components/pill";


export const ButtonSaveQR = () => {
  const context = useQRCodeGeneratorContext();

  return (
    <button onClick={context.saveCurrentQR}>
      <Pill classes="bg-primary-900 hover:bg-accent-500 hover:text-primary-900">
        save <SaveIcon size={16} className="inline" />
      </Pill>
    </button>
  );
};
