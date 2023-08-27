import dotenv from "dotenv";
dotenv.config();
import express, { Express, json, urlencoded } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { SocketSetUp } from "./src/socket/socket";
import { router } from "./src/route/routes";
import { connectDB } from "./src/connection/database";
import fileupload from "express-fileupload";
import path from "path";
import { getFriendsOfFriendsRecommendations } from "./src/controller/recomendation/user.recomendation";
connectDB();
const app: Express = express();
const server = http.createServer(app);
app.use(cors());
app.use(json());
app.use(urlencoded());
app.use(fileupload({ useTempFiles: true }));
app.use(
  "/uploaded_images",
  express.static(path.join(__dirname, "uploaded_images"))
);

app.use("/api", router);
// const CLIENT_URI = "https://chat-frontend-indol.vercel.app";
// const CLIENT_URI = process.env.CLIENT_URI;
const PORT = process.env.PORT;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: false,
  },
});

new SocketSetUp(io);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
