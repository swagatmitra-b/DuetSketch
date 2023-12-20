"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { useToolBar } from "@/toolstore";
import { Socket } from "socket.io-client";
import { useRoom } from "@/userstore";
import { drawingInfoType } from "@/types";
import { PixelStateType } from "@/types";
import Clear from "@/components/Clear";
import Sentry from "@/components/Sentry";
import Switch from "@/components/Switch";

const Canvas = ({
  socket,
  id,
  name,
  setLoader,
}: {
  socket: Socket;
  id: number;
  name: string;
  setLoader: (a: boolean) => void;
}) => {
  const [drawing, setDrawing] = useState(false);
  const [show, setShow] = useState(false);
  const [sentry, setSentry] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tool, color, strokeSize } = useToolBar((state) => state);
  const { setStatus, removeStatus, setMembers, mode, setMode } = useRoom(
    (state) => state
  );
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
    socket.emit("start", drawingInfo, id.toString(), name);
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
    socket.emit("stop", id.toString(), name);
  };

  const wipe = () => {
    setPixelState((prevState) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;

      return {
        ...prevState,
        undo: [ctx.getImageData(0, 0, canvas.width, canvas.height)],
      };
    });
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

      if (undoCount < redo.length) setUndoCount((prev) => prev + 1);

      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.putImageData(prevState as ImageData, 0, 0);

      return { ...prevPixelState, undo: newUndo };
    });
  };

  const redoCanvas = () => {
    setPixelState((prevPixelState) => {
      const { redo } = prevPixelState;

      if (redo.length === 0 || undoCount >= redo.length) {
        return prevPixelState;
      }

      const nextState = redo[redo.length - undoCount - 1];

      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.putImageData(nextState as ImageData, 0, 0);

      setUndoCount((prevUndoCount) => Math.max(prevUndoCount - 1, 0));
      return { ...prevPixelState, undo: prevPixelState.redo };
    });
  };

  const command = (message: string) => {
    setSentry(() => message);
    setShow(() => true);
    setTimeout(() => setShow(false), 1500);
  };

  useEffect(() => {
    wipe();
    const startListener = (canvasState: drawingInfoType, user: string) => {
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
      setStatus(user);
      if (pixelState.undo.length == 1) {
        setPixelState((prevState) => ({
          ...prevState,
          redo: [],
        }));
        setUndoCount((_) => 0);
      }
    };
    const receiveListener = (canvasState: drawingInfoType) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      ctx.strokeStyle = canvasState.tool == "pen" ? canvasState.color : "white";
      ctx.lineTo(canvasState.position.x, canvasState.position.y);
      ctx.stroke();
    };

    const stopListener = (user: string) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D;
      ctx.beginPath();
      removeStatus(user);
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
    socket.on("join", (user, members) => {
        setLoader(false);
        setMembers(members);
        command(`${user} has joined the room`);
    });
    socket.on("leave-room", (user, members) => {
      setMembers(members);
      command(`${user} has left the room`);
    });
    socket.on("wipe-drawing", (user) => {
      wipe();
      command(`${user} cleared the canvas`);
    });
    socket.on("undo-drawing", (user) => {
      undoCanvas();
      command(`${user} has undone`);
    });
    socket.on("redo-drawing", (user) => {
      redoCanvas();
      command(`${user} has redone`);
    });
    socket.on("disco", (user) => {
      command(`${user} has been disconnected :(`);
    });
    socket.on("mode", (user) => {
      setMode();
      command(`${user} has changed mode`);
    });

    return () => {
      socket.off("receive-drawing", receiveListener);
      socket.off("stop", stopListener);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        className={`${mode ? "bg-black" : ""}`}
      ></canvas>
      <Clear socket={socket} roomId={id.toString()} name={name} />
      <Switch mode={mode} socket={socket} roomId={id.toString()} name={name} />
      <Sentry message={sentry} show={show} />
    </div>
  );
};

export default Canvas;
