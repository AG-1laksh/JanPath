"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { translations, type Language } from "@/lib/translations";

export type { Language };

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("English");
  const [notifications, setNotifications] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from local storage if available
    const storedLang = localStorage.getItem("janpath-language");
    if (storedLang) setLanguage(storedLang as Language);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("janpath-language", language);
    }
  }, [language, mounted]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || key;
  }, [language]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SettingsContext.Provider
        value={{
          language,
          setLanguage,
          notifications,
          setNotifications,
          t,
        }}
      >
        {children}
      </SettingsContext.Provider>
    </NextThemesProvider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
