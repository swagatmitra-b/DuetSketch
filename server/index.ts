import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const PORT = 3001;

app.use(cors());

const server = createServer(app);
console.log(process.env.CLIENT_URL);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    // origin: "http://localhost:3000",
    methods: "GET",
  },
});

const members: Map<string, string[]> = new Map();

io.on("connection", (socket) => {
  socket.on("start", (drawingInfo, room, user) => {
    io.to(room).emit("start-drawing", drawingInfo, user);
  });
  socket.on("draw", (drawingInfo, room) => {
    io.to(room).emit("receive-drawing", drawingInfo);
  });
  socket.on("stop", (room, user) => {
    io.to(room).emit("stop-drawing", user);
  });
  socket.on("room", (room, user) => {
    if (!members.get(room)) {
      members.set(room, [user]);
      socket.join(room);
      io.to(room).emit("join", user, [user]);
      return;
    } else {
      const current = members.get(room) as string[];
      if (current.includes(user)) return;
      current.push(user);
      socket.join(room);
      io.to(room).emit("join", user, current);
    }
  });
  socket.on("leave", (room, user) => {
    let current = members.get(room) as string[];
    if (!current) return;
    current = current.filter((mem) => mem != user);
    members.set(room, current);
    socket.leave(room);
    io.to(room).emit("leave-room", user, current);
  });
  socket.on("wipe", (room, user) => {
    io.to(room).emit("wipe-drawing", user);
  });
  socket.on("undo", (room, user) => {
    io.to(room).emit("undo-drawing", user);
  });
  socket.on("redo", (room, user) => {
    io.to(room).emit("redo-drawing", user);
  });
  socket.on("mode", (room, user) => {
    io.to(room).emit("mode", user);
  });
  socket.on("disco", (room, user) => {
    let current = members.get(room) as string[];
    if (!current) return;
    current = current.filter((mem) => mem != user);
    members.set(room, current);
    socket.leave(room);
    io.to(room).emit("disco", user);
  });
});

server.listen(PORT, () => console.log("server is running on port", PORT));
