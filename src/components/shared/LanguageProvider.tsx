"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANGUAGE,
  STORAGE_KEY,
  isLanguageCode,
  translate,
  type LanguageCode,
} from "@/lib/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguageCode(stored)) return stored;
    } catch {
      // ignore storage errors (private mode etc.)
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isLanguageCode(event.newValue)) {
        setLanguageState(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
    document.documentElement.lang = code;
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      translate(language, key, vars),
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
