import { Socket } from "socket.io-client";

const Clear = ({
  roomId,
  socket,
  name,
}: {
  roomId: string;
  socket: Socket;
  name: string;
}) => {
  return (
    <div className="absolute bottom-2 left-3 bg-white rounded-md px-2">
      <button
        onClick={() => {
          socket.emit("undo", roomId, name);
        }}
        className="p-2"
      >
        Undo
      </button>
      <button
        onClick={() => {
          socket.emit("redo", roomId, name);
        }}
        className="p-2"
      >
        Redo
      </button>
      <button
        className="p-3"
        onClick={() => {
          socket.emit("wipe", roomId, name);
        }}
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default Clear;
