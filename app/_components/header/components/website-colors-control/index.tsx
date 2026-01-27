import { RotateCw, Save, Trash2 } from "lucide-react";

import { Range } from "./components/range";
import { useRandomWebsiteColors } from "./helpers/use-random-website-colors";

export const WebsiteColorsControl = () => {
  const websiteColors = useRandomWebsiteColors();

  return (
    <div className="absolute top-0 right-0 z-10 m-4 flex flex-col gap-2 opacity-0 duration-500 hover:opacity-100">
      <Range
        name="--primary"
        classes="text-primary-800"
        value={websiteColors.primaryHue}
      />
      <Range
        name="--accent"
        classes="text-accent-500"
        value={websiteColors.accentHue}
      />

      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={websiteColors.randomizeColors}
          className="text-primary-900 hover:text-accent-500 transition-colors"
          aria-label="Randomize colors"
        >
          <RotateCw size={16} />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={websiteColors.saveWebsiteColorsToLocalStorage}
            className="transition-colors text-primary-900 hover:text-accent-500"
            aria-label="Save colors"
          >
            <Save size={16} />
          </button>

          {websiteColors.storedColors && (
            <button
              onClick={websiteColors.removeWebsiteColorsFromLocalStorage}
              className="text-primary-900 hover:text-accent-500 transition-colors"
              aria-label="Remove saved colors"
            >
              <Trash2 size={16} />
            </button>
          )}

          {websiteColors.storedColors && (
            <div className="flex items-center gap-1">
              <button
                onClick={websiteColors.resetToStoredPrimaryColor}
                className="h-3 w-3 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
                style={{
                  backgroundColor: `hsl(${websiteColors.storedColors.primaryHue}, 100%, 20%)`,
                }}
                aria-label="Reset to saved primary color"
              />

              <button
                onClick={websiteColors.resetToStoredAccentColor}
                className="h-3 w-3 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
                style={{
                  backgroundColor: `hsl(${websiteColors.storedColors.accentHue}, 100%, 75%)`,
                }}
                aria-label="Reset to saved accent color"
              />
            </div>
          )}
        </div>
      </div>
    </div>

  );
};
