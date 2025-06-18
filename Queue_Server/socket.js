let io;

//  This module initializes and exports the Socket.IO instance for use in other parts of the application.
function initSocket(server) {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join-clinic", (clinicId) => {
      socket.join(clinicId);
      console.log(`User joined clinic ${clinicId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

// This function returns the initialized Socket.IO instance.
function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIO };
