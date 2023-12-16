"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Toolbar from "../components/Toolbar";
import Canvas from "@/components/Canvas";

export default function Home() {
  const [socket, setSocket] = useState<Socket>(io("https://duetsketch-server.onrender.com"));

  useEffect(() => {
    let soc = io("https://duetsketch-server.onrender.com/");
    setSocket(soc);
    return () => {
      soc.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Toolbar />
      <Canvas socket={socket} />
    </div>
  );
}
