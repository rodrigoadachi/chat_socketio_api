import express, { Express } from "express";
import cors from "cors";

import { config } from "dotenv";
import { UserRouter } from "./users/user.router";
import { MessageRouter } from "./message/message.router";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { MessageService } from "./message/message.service";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const bootstrap = async () => {
  config();

  const app: Express = express();

  const corsOptions = {
    origin: ["http://localhost:3000", "http://172.16.1.201:3000"],
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  app.use(express.json());

  const port: number = Number(process.env.APP_PORT) || 3000;

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
    },
  });

  httpServer.listen(port, () =>
    console.log(`chat socketio running on port ${port}`)
  );

  const messageService = new MessageService();
  io.on("connection", async (socket: Socket<DefaultEventsMap>) => {
    await messageService.socketService(socket);
  });

  app.use("/user", UserRouter());
  app.use("/message", MessageRouter());
};

bootstrap();
