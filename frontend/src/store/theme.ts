import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next: Theme = get().theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark", next === "dark");
        set({ theme: next });
      },
      setTheme: (t) => {
        document.documentElement.classList.toggle("dark", t === "dark");
        set({ theme: t });
      },
    }),
    { name: "theme-storage" }
  )
);
