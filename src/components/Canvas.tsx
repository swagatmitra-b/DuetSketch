"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { useToolBar } from "@/toolstore";
import { Socket } from "socket.io-client";
import { useRoom } from "@/userstore";
import { drawingInfoType } from "@/types";
import { PixelStateType } from "@/types";
import Clear from "@/components/Clear";
import Sentry from "./Sentry";

const Canvas = ({
  socket,
  id,
  name,
}: {
  socket: Socket;
  id: number;
  name: string;
}) => {
  const [drawing, setDrawing] = useState(false);
  const [sentry, setSentry] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tool, color, strokeSize } = useToolBar((state) => state);
  const { members, setMembers } = useRoom((state) => state);
  const [pixelState, setPixelState] = useState<PixelStateType>({
    undo: [],
    redo: [],
  });
  const [undoCount, setUndoCount] = useState(0);

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
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
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    setPixelState((prevState) => ({
      ...prevState,
      undo: [ctx.getImageData(0, 0, canvas.width, canvas.height)],
    }));
  };

  const undoCanvas = () => {
    setPixelState((prevPixelState) => {
      const { undo, redo } = prevPixelState;

      if (undo.length < 2) {
        wipe();
        return prevPixelState;
      }

      const prevState = undo[undo.length - 2];
      const newUndo = undo.slice(0, -1);

      if (undoCount < redo.length) setUndoCount(undoCount + 1);

      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.putImageData(prevState as ImageData, 0, 0);

      return { ...prevPixelState, undo: newUndo };
    });
  };

  const redoCanvas = () => {
    setPixelState((prevPixelState) => {
      const { redo } = prevPixelState;

      console.log(undoCount, redo.length);

      if (redo.length === 0 || undoCount >= redo.length) {
        return prevPixelState;
      }

      console.log("passed");
      const nextState = redo[redo.length - undoCount - 1];

      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.putImageData(nextState as ImageData, 0, 0);

      setUndoCount((prevUndoCount) => Math.max(prevUndoCount - 1, 0));
      return { ...prevPixelState, undo: prevPixelState.redo };
    });
  };

  useEffect(wipe, []);

  useEffect(() => {
    const startListener = (canvasState: drawingInfoType) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.strokeStyle = canvasState.tool == "pen" ? canvasState.color : "white";
      ctx.lineWidth = canvasState.strokeSize;
      ctx.lineTo(canvasState.position.x, canvasState.position.y);
      ctx.stroke();
      if (pixelState.undo.length == 1) {
        setPixelState((prevState) => ({
          ...prevState,
          redo: [],
        }));
        setUndoCount(0);
      }
    };
    const receiveListener = (canvasState: drawingInfoType) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      ctx.lineTo(canvasState.position.x, canvasState.position.y);
      ctx.stroke();
    };

    const stopListener = () => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      ctx.beginPath();
      setPixelState((prevState) => ({
        ...prevState,
        redo: [
          ...prevState.redo,
          ctx.getImageData(0, 0, canvas.width, canvas.height),
        ],
        undo: [
          ...prevState.undo,
          ctx.getImageData(0, 0, canvas.width, canvas.height),
        ],
      }));
    };

    socket.on("start-drawing", startListener);
    socket.on("receive-drawing", receiveListener);
    socket.on("stop-drawing", stopListener);
    socket.on("join", (room, user, members) => {
      setMembers(members);
      setSentry(`${user} has joined the room`);
      setTimeout(() => setSentry(""), 2000);
    });
    socket.on("leave-room", (room, user, members) => {
      setMembers(members);
      setSentry(`${user} has left the room`);
      setTimeout(() => setSentry(""), 2000);
    });
    socket.on("wipe-drawing", () => {
      wipe();
    });
    socket.on("undo-drawing", (message) => {
      console.log(name, message);
      if (message == name) return;
      console.log("undid");
      undoCanvas();
    });
    socket.on("redo-drawing", (message) => {
      console.log(name, message);
      // if (message == name) return;
      console.log("redo");
      redoCanvas();
    });

    return () => {
      socket.off("receive-drawing", receiveListener);
      socket.off("stop", stopListener);
    };
  }, []);

  useEffect(() => {
    console.log(pixelState);
  }, [pixelState]);

  return (
    <div className="flex justify-center">
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
        name={name}
      />
      <Sentry message={sentry} />
    </div>
  );
};

export default Canvas;
