// Socket.IO singleton
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

function init(server) {
  io = new Server(server, {
    cors: { origin: ["http://localhost:5173"], methods: ["GET","POST","PATCH"] }
  });

  io.on("connection", (socket) => {
    try {
      const tok =
        socket.handshake.auth?.token ||
        (socket.handshake.headers.authorization || "").replace("Bearer ", "") ||
        socket.handshake.query?.token;

      if (tok) {
        const p = jwt.verify(tok, process.env.JWT_SECRET);
        if (p.role === "staff") socket.join("staff");
      }
    } catch (_) {}
    socket.on("join", (room) => { if (room === "staff") socket.join("staff"); });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}

module.exports = { init, getIO };
