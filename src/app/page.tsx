"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Toolbar from "../components/Toolbar";
import Canvas from "@/components/Canvas";

export default function Home() {
  const [socket, setSocket] = useState<Socket>(io("http://localhost:3002"));

  useEffect(() => {
    let soc = io("http://localhost:3002");
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
