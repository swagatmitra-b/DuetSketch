import { create } from "zustand";

type Users = {
  name: string;
  members: string[];
  status: string[];
  mode: boolean;
  setUserName: (a: string) => void;
  setMembers: (b: string[]) => void;
  setStatus: (c: string) => void;
  removeStatus: (d: string) => void;
  setMode: () => void;
};

export const useRoom = create<Users>((set) => ({
  name: "",
  members: [],
  status: [],
  mode: false,
  setMode: () => set((state) => ({ mode: !state.mode })),
  setUserName: (user) => set(() => ({ name: user })),
  setMembers: (newMembers: string[]) => set(() => ({ members: newMembers })),
  setStatus: (user: string) =>
    set((state) => ({ status: [...state.status, user] })),
  removeStatus: (user: string) =>
    set((state) => ({ status: state.status.filter((mem) => mem != user) })),
}));
