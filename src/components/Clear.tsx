"use client";

import { Socket } from "socket.io-client";

const Clear = ({
  roomId,
  wipe,
  undoCanvas,
  redoCanvas,
  socket,
}: {
  roomId: string;
  socket: Socket;
  wipe: () => void;
  undoCanvas: () => void;
  redoCanvas: () => void;
}) => {
  return (
    <div className="absolute bottom-2 left-3">
      <button onClick={undoCanvas} className="p-2">
        Undo
      </button>
      <button onClick={redoCanvas} className="p-2">
        Redo
      </button>
      <button
        className="p-3"
        onClick={() => {
          socket.emit("wipe", roomId);
          wipe();
        }}
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default Clear;
