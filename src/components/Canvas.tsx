"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { useToolBar } from "@/store";
import { Socket } from "socket.io-client";

const Canvas = ({ socket }: { socket: Socket }) => {
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tool, color, strokeSize } = useToolBar((state) => state);

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    // ctx.lineCap = "round";
    // ctx.lineWidth = strokeSize;
    // ctx.strokeStyle = tool == "pen" ? color : "white";
    ctx.beginPath();
    // ctx.lineTo(e.clientX, e.clientY);
    // ctx.stroke();
    setDrawing(true);
    const drawingInfo = {
      type: "down",
      color,
      strokeSize,
      position: { x: e.clientX, y: e.clientY },
    };
    socket.emit("drawing", drawingInfo, "down");
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    // const canvas = canvasRef.current as HTMLCanvasElement;
    // const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    // ctx.lineTo(e.clientX, e.clientY);
    // ctx.stroke();
    const drawingInfo = {
      type: "move",
      color,
      strokeSize,
      position: { x: e.clientX, y: e.clientY },
    };
    socket.emit("drawing", drawingInfo);
  };

  const stopDrawing = () => {
    setDrawing(false);
    socket.emit("stop");
  };

  const wipe = () => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  };

  useEffect(wipe, []);

  useEffect(() => {
    socket.on("receive-drawing", (canvasState) => {
      console.log("receiving data", canvasState);
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.lineCap = "round";
      ctx.strokeStyle = canvasState.color;
      ctx.lineWidth = canvasState.strokeSize;
      // ctx.beginPath();
      ctx.lineTo(canvasState.position.x, canvasState.position.y);
      ctx.stroke();
    });
    socket.on("stop", () => {
      console.log("top stop");
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.beginPath();
    });
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      ></canvas>
    </div>
  );
};

export default Canvas;
