require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const playerSchema = new mongoose.Schema({
  username: String,
  x: Number,
  y: Number,
});

const Player = mongoose.model("Player", playerSchema);

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  socket.on("move", async (data) => {
    await Player.findOneAndUpdate({ username: data.username }, data, { upsert: true });
    io.emit("updatePlayers", await Player.find());
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

app.get("/", (req, res) => res.send("PixelVerse API Running"));

server.listen(5000, () => console.log("Server running on port 5000"));
