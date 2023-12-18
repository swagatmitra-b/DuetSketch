"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoom } from "@/userstore";

const Join = () => {
  const { setUserName } = useRoom((state) => state);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [actionText, setActionText] = useState({
    create: "Create Room",
    join: "Join Room",
  });

  const router = useRouter();

  const createRoom = async () => {
    if (!name) {
      setActionText({ ...actionText, create: "Please enter a name" });
      setInterval(
        () => setActionText({ ...actionText, create: "Create Room" }),
        1000
      );
      return;
    }
    const id = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    setRoomId(String(id));
    joinRoom(id);
  };

  const joinRoom = (id: number) => {
    if (!name) {
      setActionText({ ...actionText, join: "Please enter a name" });
      setTimeout(
        () => setActionText({ ...actionText, join: "Join Room" }),
        1000
      );
      return;
    }
    if (name && !roomId && !id) {
      setActionText({ ...actionText, join: "Please enter a RoomID" });
      setTimeout(
        () => setActionText({ ...actionText, join: "Join Room" }),
        1000
      );
      return;
    }
    if (+roomId <= 99999 && +roomId >= 10000) {
      setUserName(name);

      router.push(`/board/${roomId}`);
    }
    if (id <= 99999 && id >= 10000) {
      setUserName(name);
      router.push(`/board/${id}`);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-4 border border-black rounded-md">
      <div className="flex flex-col gap-2">
        <h2>Enter Name</h2>
        <input
          type="text"
          placeholder="username"
          className="p-2 rounded-md border border-black"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2>Enter RoomID</h2>
        <input
          type="text"
          placeholder="RoomID (5 digit)"
          className="p-2 rounded-md border-black border"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <button
        className="p-2 border border-black rounded-md hover:bg-black hover:text-white ease-in duration-150"
        onClick={createRoom}
      >
        {actionText.create}
      </button>
      <button
        className="p-2 border border-black rounded-md hover:bg-black hover:text-white ease-in duration-150"
        onClick={() => joinRoom(1)}
      >
        {actionText.join}
      </button>
    </div>
  );
};

export default Join;
