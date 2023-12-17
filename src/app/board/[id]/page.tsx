"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useParams } from "next/navigation";
import { useRoom } from "@/userstore";
import { useRouter } from "next/navigation";
import Toolbar from "@/components/Toolbar";
import Canvas from "@/components/Canvas";
import Room from "@/components/Room";
import Leave from "@/components/Leave";

export default function Board() {
  const { name } = useRoom((state) => state);
  const [socket, setSocket] = useState<Socket>(io("https://duetsketch-server.onrender.com/"));
  const { id } = useParams();
  const [roomId] = useState(+id);
  const router = useRouter();

  const leaveRoom = () => {
    socket.emit("leave", roomId.toString(), name);
    router.push("/");
  };

  useEffect(() => {
    let soc = io("https://duetsketch-server.onrender.com/");
    // let soc = io("http://localhost:3001");
    setSocket(soc);
    if (!name) return;
    socket.emit("room", roomId.toString(), name);
    return () => {
      soc.disconnect();
    };
  }, []);

  if (!name) router.push("/");

  return (
    <div>
      {name && (
        <div className="min-h-screen flex justify-center items-center">
          <Toolbar />
          <Room name={name} />
          <Canvas socket={socket} id={roomId} />
          <Leave leaveRoom={leaveRoom} />
        </div>
      )}
    </div>
  );
}
