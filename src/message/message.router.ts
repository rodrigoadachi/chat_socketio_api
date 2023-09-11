import { Router } from "express";
import { MessageController } from "./message.controller";

const router: Router = Router();

const messageController = new MessageController();

export const MessageRouter = (): Router => {
  router.post("/", messageController.CreateMessage);
  router.get("/:chatId", messageController.ListMessagesByChatId);
  return router;
};
