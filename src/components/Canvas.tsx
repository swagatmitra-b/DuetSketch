"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { useToolBar } from "@/toolstore";
import { Socket } from "socket.io-client";
import { useRoom } from "@/userstore";
import Clear from "@/components/Clear";

interface drawingInfo {
  type: string;
  tool: string;
  color: string;
  strokeSize: number;
  position: { x: number; y: number };
}

const Canvas = ({ socket, id }: { socket: Socket; id: number }) => {
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tool, color, strokeSize } = useToolBar((state) => state);
  const { members, setMembers } = useRoom((state) => state);

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.beginPath();
    setDrawing(true);
    const drawingInfo = {
      type: "down",
      tool,
      color,
      strokeSize,
      position: { x: e.clientX, y: e.clientY },
    };
    socket.emit("start", drawingInfo, id.toString());
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const drawingInfo = {
      type: "move",
      tool,
      color,
      strokeSize,
      position: { x: e.clientX, y: e.clientY },
    };
    socket.emit("draw", drawingInfo, id.toString());
  };

  const stopDrawing = () => {
    setDrawing(false);
    socket.emit("stop", id.toString());
  };

  const wipe = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  };

  const undoCanvas = () => {};

  const redoCanvas = () => {};

  useEffect(wipe, []);

  useEffect(() => {
    const startListener = (canvasState: drawingInfo) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.strokeStyle = canvasState.tool == "pen" ? canvasState.color : "white";
      ctx.lineWidth = canvasState.strokeSize;
      ctx.lineTo(canvasState.position.x, canvasState.position.y);
      ctx.stroke();
    };
    const receiveListener = (canvasState: drawingInfo) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.lineTo(canvasState.position.x, canvasState.position.y);
      ctx.stroke();
    };

    const stopListener = () => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.beginPath();
    };

    socket.on("start-drawing", startListener);
    socket.on("receive-drawing", receiveListener);
    socket.on("stop-drawing", stopListener);
    socket.on("join", (room, user, members) => {
      setMembers(members);
      console.log(user, "has joined room", room, members);
    });
    socket.on("leave-room", (room, user, members) => {
      setMembers(members);
      console.log(user, "has left the room", room, members);
    });
    socket.on("wipe-drawing", () => {
      wipe();
    });

    return () => {
      socket.off("receive-drawing", receiveListener);
      socket.off("stop", stopListener);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      ></canvas>
      <Clear
        wipe={wipe}
        undoCanvas={undoCanvas}
        redoCanvas={redoCanvas}
        socket={socket}
        roomId={id.toString()}
      />
    </div>
  );
};

export default Canvas;
