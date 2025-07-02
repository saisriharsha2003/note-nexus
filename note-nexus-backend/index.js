import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { subscriber } from './redis.js';
import userRouter from './routes/Routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

await subscriber.subscribe('note_updates', (message) => {
  const data = JSON.parse(message);
  console.log("Redis Update:", data.message);
  io.emit('notification', data);
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

app.use("/api/user", userRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
