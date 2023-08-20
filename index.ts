import express, { Express, json, urlencoded } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { SocketSetUp } from "./src/socket/socket";
import { router } from "./src/route/routes";
import { connectDB } from "./src/connection/database";
connectDB();
const app: Express = express();
const server = http.createServer(app);
app.use(json());
app.use(urlencoded());
app.use(cors());
app.use("/api", router);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    // credentials: true,
  },
});
new SocketSetUp(io);

server.listen(5000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${5000}`);
});
