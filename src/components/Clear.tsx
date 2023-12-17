"use client";

import { Socket } from "socket.io-client";

const Clear = ({
  roomId,
  wipe,
  undoCanvas,
  redoCanvas,
  socket,
  name,
}: {
  roomId: string;
  socket: Socket;
  name: string;
  wipe: () => void;
  undoCanvas: () => void;
  redoCanvas: () => void;
}) => {
  return (
    <div className="absolute bottom-2 left-3 bg-white rounded-md">
      <button
        onClick={() => {
          socket.emit("undo", roomId, name);
          undoCanvas();
        }}
        className="p-2"
      >
        Undo
      </button>
      <button
        onClick={() => {
          socket.emit("redo", roomId, name);
          redoCanvas();
        }}
        className="p-2"
      >
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
