import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import geminiRouter from "./routes/gemini";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));


app.use(express.json());
app.use("/api/gemini", geminiRouter);


const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store room states
const roomStates: Record<string, any[]> = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("room", (room) => {
    socket.join(room);
    console.log("joined room:", room);

    // Send existing state if room already has shapes
    if (roomStates[room]) {
      socket.emit("drawing", roomStates[room]);
      console.log("sent existing state to new user:", roomStates[room]);
    }
  });


 socket.on("drawing", (shape) => {
  const rooms = [...socket.rooms].filter((r) => r !== socket.id);

  rooms.forEach((room) => {
    if (!roomStates[room]) roomStates[room] = [];

    // replace if exists, otherwise push
    const idx = roomStates[room].findIndex(s => s.id === shape.id);
    if (idx !== -1) {
      roomStates[room][idx] = shape;
    } else {
      roomStates[room].push(shape);
    }

    socket.to(room).emit("drawing", shape);
  });
});

// move delete handler OUTSIDE
socket.on("delete-shape", (shapeId) => {
  const rooms = [...socket.rooms].filter((r) => r !== socket.id);

  rooms.forEach((room) => {
    if (roomStates[room]) {
      roomStates[room] = roomStates[room].filter(s => s.id !== shapeId);
      io.to(room).emit("take-delete-shape", shapeId);
    }
  });
});

socket.on("clear-canvas", (roomId) => {
  if (!roomStates[roomId]) return;

  roomStates[roomId] = []; // reset server state

  // emit to everyone in the room, including sender
  io.to(roomId).emit("take-clear-canvas", []);
});

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
