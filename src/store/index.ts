import { create } from "zustand";

interface AppState {
  domain: string;
  subdomains: string[];
  loading: boolean;
  error: string | null;
  setDomain: (domain: string) => void;
  setSubdomains: (subdomains: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  domain: "",
  subdomains: [],
  loading: false,
  error: null,
  setDomain: (domain) => set({ domain }),
  setSubdomains: (subdomains) => set({ subdomains }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));