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
  const [socket, setSocket] = useState<Socket>(
    io(`${process.env.NEXT_PUBLIC_SERVER_URL}`)
  );
  const [loader, setLoader] = useState(true);
  const { id } = useParams();
  const [roomId] = useState(+id);
  const router = useRouter();

  const leaveRoom = () => {
    socket.emit("leave", roomId.toString(), name);
    router.push("/");
  };

  window.addEventListener("beforeunload", () => {
    socket.emit("disco", roomId.toString(), name);
  });

  useEffect(() => {
    let soc = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`);
    setSocket(soc);
    if (!name) return;
    socket.emit("room", roomId.toString(), name);
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!name) router.push("/");

  return (
    <div>
      {name && (
        <div className="min-h-screen flex justify-center items-center">
          <Toolbar />
          <Room name={name} loader={loader}/>
          <Canvas socket={socket} id={roomId} name={name} setLoader={setLoader} />
          <Leave leaveRoom={leaveRoom} id={String(roomId)} />
        </div>
      )}
    </div>
  );
}
