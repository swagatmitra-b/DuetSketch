import { create } from "zustand";

type Tools = "pen" | "eraser";

type ToolBState = {
  tool: Tools;
  color: string;
  strokeSize: number;
};

type ToolBActions = {
  setColor: (a: string) => void;
  setTool: (b: Tools) => void;
  setStrokeSize: (c: number) => void;
};

export const useToolBar = create<ToolBState & ToolBActions>((set) => ({
  tool: "pen",
  color: "black",
  strokeSize: 6,
  setColor: (newColor: string) => set(() => ({ color: newColor })),
  setTool: (newTool: Tools) => set(() => ({ tool: newTool })),
  setStrokeSize: (newSize: number) => set(() => ({ strokeSize: newSize })),
}));
