import { create } from "zustand";

type Users = {
  name: string;
  members: string[];
  setUserName: (a: string) => void;
  setMembers: (b: string[]) => void;
};

export const useRoom = create<Users>((set) => ({
  name: "",
  members: [],
  setUserName: (user) => set(() => ({ name: user })),
  setMembers: (newMembers: string[]) =>
    set(() => ({ members: newMembers })),
}));
