import { Request, Response } from "express";
import { MessageService } from "./message.service";

const messageService = new MessageService();

export class MessageController {
  async CreateMessage(req: Request, res: Response) {
    const result = await messageService.CreateMessage(req.body);
    if (!result) return res.status(400).json({ error: result });
    return res.status(200).json(result).end();
  }

  async ListMessagesByChatId(req: Request, res: Response) {
    const { chatId } = req.params;
    const result = await messageService.ListMessagesByChatId(chatId);
    return res.status(200).json(result).end();
  }
}
