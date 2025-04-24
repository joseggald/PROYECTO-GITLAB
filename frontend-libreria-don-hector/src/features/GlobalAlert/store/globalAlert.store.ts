import { create } from "zustand";

interface AlertState {
  isOpen: boolean;
  title: string;
  description: string;
  onCloseCallback?: () => void;
  onOpenCallback?: () => void;
  openAlert: () => void;
  closeAlert: () => void;
  setTitle: (title: string) => void;
  setDescription: (body: string) => void;
  setOnCloseCallback: (callback?: () => void) => void;
  setOnOpenCallback: (callback?: () => void) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  onCloseCallback: undefined,
  onOpenCallback: undefined,
  openAlert: () =>
    set((state) => {
      state.onOpenCallback?.();
      return { isOpen: true };
    }),
  closeAlert: () =>
    set((state) => {
      state.onCloseCallback?.();
      return {
        isOpen: false,
        title: "",
        description: "",
        onCloseCallback: undefined,
        onOpenCallback: undefined,
      };
    }),
  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setOnCloseCallback: (callback?: () => void) =>
    set({ onCloseCallback: callback }),
  setOnOpenCallback: (callback?: () => void) =>
    set({ onOpenCallback: callback }),
}));
