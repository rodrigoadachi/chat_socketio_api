import { prisma } from "../database/mongodb.database";
import { MessageDto } from "./dto/message.dto";
import { UserService } from "../users/user.service";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const userService = new UserService();

type iPayload = {
  authorId: string;
  chatId?: string;
  text: string;
};

export class MessageService {
  async CreateMessage(dto: MessageDto | iPayload): Promise<MessageDto> {
    try {
      const author = await userService.FindUserById(dto?.authorId);
      if (!author) throw new Error("Usuário não encontrado");
      return await prisma.message.create({
        data: {
          chatId: dto?.chatId || " ",
          authorId: dto.authorId,
          text: dto?.text,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.log({ error });
      return {} as MessageDto;
    }
  }

  async ListMessagesByChatId(
    chatId: string
  ): Promise<MessageDto[] | unknown[]> {
    try {
      return await prisma.message.findMany({
        where: {
          chatId,
        },
        include: {
          author: true,
        },
      });
    } catch (error) {
      console.log({ error });
      return [] as MessageDto[];
    }
  }

  async ListAllMessages(): Promise<MessageDto[]> {
    try {
      const result = await prisma.message.findMany({
        include: {
          author: true,
        },
      });
      return result;
    } catch (error) {
      console.log({ error });
      return [] as MessageDto[];
    }
  }

  async socketService(socket: Socket<DefaultEventsMap>) {
    socket.on("NewConnection", async (data: any) => {
      if (!!data?.id)
        await userService.UpdateChatIdToUserById(data?.id, socket?.id);
      const oldMsgs = await this.ListAllMessages();
      const msgs = oldMsgs.map((msg) => {
        return {
          author: msg?.author,
          id: msg?.id,
          text: msg?.text,
          timestamp: msg?.timestamp,
        };
      });
      socket.emit("UpdateMsgs", { userId: data?.id, msgs });
    });

    socket.on("NewMessageToServer", async (data: any) => {
      try {
        const payload: iPayload = {
          authorId: data?.author?.id,
          chatId: data?.chatId,
          text: data?.text,
        };
        const result: MessageDto = await this.CreateMessage(payload);

        const author = await userService.FindUserById(result?.authorId);
        await socket.broadcast.emit("NewMessageFromServer", {
          author,
          id: result?.id,
          message: result?.text,
          timestamp: result?.timestamp,
        });
      } catch (error) {
        console.log({ error });
      }
    });
  }
}
