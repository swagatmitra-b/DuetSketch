import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { Socket } from "socket.io-client";

const Switch = ({
  mode,
  socket,
  roomId,
  name,
}: {
  mode: boolean;
  socket: Socket;
  roomId: string;
  name: string
}) => {
  return (
    <div className="absolute top-3 left-3">
      <button
        onClick={() => socket.emit("mode", roomId, name)}
        className="p-3  rounded-md bg-white border-white border-2"
      >
        {mode ? <BsSunFill /> : <BsMoonFill />}
      </button>
    </div>
  );
};

export default Switch;
