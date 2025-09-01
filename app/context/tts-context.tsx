"use client";
import { createContext, useContext, useState } from "react";

type TTSContextType = {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
};

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(true); // default ON
  return (
    <TTSContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = () => {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("useTTS must be used inside TTSProvider");
  return ctx;
};
