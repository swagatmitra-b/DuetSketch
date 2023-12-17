"use client";

import { useToolBar } from "@/toolstore";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { LuPencil } from "react-icons/lu";
import { BiEraser } from "react-icons/bi";

const Toolbar = () => {
  const [disabled, setDisabled] = useState(false);
  const dragRef = useRef(null);
  const { tool, setTool, setColor, setStrokeSize } = useToolBar(
    (state) => state
  );

  return (
    <Draggable nodeRef={dragRef} disabled={disabled}>
      <div
        className="absolute border-2 border-black rounded-md p-5 w-40 flex flex-col items-center bg-white z-10"
        ref={dragRef}
      >
        <input
          type="color"
          className="px-1"
          onChange={(e) => setColor(e.target.value)}
        />
        <div className="flex gap-3 my-3">
          <div
            className={`p-3 border border-slate-400 rounded-md cursor-pointer ${
              tool == "pen" ? " bg-gray-400" : ""
            }`}
            onClick={() => setTool("pen")}
          >
            <LuPencil />
          </div>
          <div
            className={`p-3 border border-slate-400 rounded-md cursor-pointer ${
              tool == "eraser" ? " bg-gray-400" : ""
            }`}
            onClick={() => setTool("eraser")}
          >
            <BiEraser />
          </div>
        </div>
        <input
          type="range"
          defaultValue={6}
          onMouseOver={() => setDisabled(true)}
          onMouseOut={() => setDisabled(false)}
          onChange={(e) => setStrokeSize(parseInt(e.target.value))}
        />
      </div>
    </Draggable>
  );
};

export default Toolbar;
