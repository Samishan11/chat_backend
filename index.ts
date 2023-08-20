import express, { Express } from "express";
import { Server } from "socket.io";
import http from "http";
const server = http.createServer(express());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

//
import { SocketSetUp } from "./src/socket/socket";
new SocketSetUp(io);

server.listen(5000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${5000}`);
});
