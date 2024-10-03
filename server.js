const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));
//logica del chat
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("chat message", (data) => {
    const timestamp = new Date().toLocaleDateString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const messageData = { ...data, timestamp };
    io.emit("chat message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
});
//puerto
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
