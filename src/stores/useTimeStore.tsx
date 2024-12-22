import { create } from "zustand";

interface TimeInfo {
  currentTime: number;
  durationTime: number;
  setCurrentTime: (currentTime: number) => void;
  setDurationTime: (durationTime: number) => void;
}

const useTimeStore = create<TimeInfo>((set) => ({
  currentTime: 0,
  durationTime: 2000,
  setCurrentTime: (currentTime: number) => {
    set({ currentTime });
  },
  setDurationTime: (durationTime: number) => {
    set({ durationTime });
  },
}));

export default useTimeStore;
