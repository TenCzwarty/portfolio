import React from "react";

const BackgroundVideoContext = React.createContext<{ videoUrl: string, setVideoUrl: React.Dispatch<React.SetStateAction<string>>, videoOptions: { start?: number, end?: number }, setVideoOptions: React.Dispatch<React.SetStateAction<{ start?: number, end?: number }>> }>({ videoUrl: "", setVideoUrl: () => { }, videoOptions: {}, setVideoOptions: () => { } });

export const BackgroundVideoContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoUrl, setVideoUrl] = React.useState("");
  const [videoOptions, setVideoOptions] = React.useState<{ start?: number, end?: number, onStart?: () => void }>({});

  return (
    <BackgroundVideoContext.Provider value={{ videoUrl, setVideoUrl, videoOptions, setVideoOptions }}>
      {children}
    </BackgroundVideoContext.Provider>
  );
};

export const useBackgroundVideoContext = () => React.useContext(BackgroundVideoContext);
