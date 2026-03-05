"use client";

import { themeConfig } from "@utils/theme";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import Cookies from "js-cookie";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type ColorModeContextType = {
  mode: string;
  /**
   * Toggle theme when called with no args, or force a specific mode
   * when called with \"light\" or \"dark\".
   */
  setMode: (mode?: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

type ColorModeContextProviderProps = {
  defaultMode?: string;
};

export const ColorModeContextProvider: React.FC<
  PropsWithChildren<ColorModeContextProviderProps>
> = ({ children, defaultMode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setModeState] = useState(defaultMode || "light");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const theme = Cookies.get("theme") || "light";
      setModeState(theme);
    }
  }, [isMounted]);

  // Sync data-theme attribute on document so CSS [data-theme="dark"] applies
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode]);

  const setColorMode = (nextMode?: string) => {
    const targetMode =
      nextMode ?? (mode === "light" ? "dark" : "light");

    setModeState(targetMode);
    Cookies.set("theme", targetMode);
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ConfigProvider
        // you can change the theme colors here. example: ...RefineThemes.Magenta,
        theme={{
          ...themeConfig,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};

