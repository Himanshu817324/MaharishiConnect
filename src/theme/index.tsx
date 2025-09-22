import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { DarkColors, LightColors } from "./colors";

type ThemeContextType = {
  colors: typeof LightColors;
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
