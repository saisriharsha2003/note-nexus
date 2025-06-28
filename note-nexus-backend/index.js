import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { subscriber, connectRedis } from './redis.js';
import userRouter from './routes/Routes.js';

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use("/api/user", userRouter);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 8081;

const startServer = async () => {
  await connectRedis();

  await subscriber.subscribe('note_updates', (message) => {
    const data = JSON.parse(message);
    console.log("📩 Redis Update:", data.message);
    io.emit('notification', data);
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
