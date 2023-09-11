import { prisma } from "../database/mongodb.database";
import { UserDto } from "./dto/user.dto";

export class UserService {
  constructor() {}

  async CreateUser(dto: UserDto): Promise<UserDto | unknown> {
    try {
      const user = await this.FindUserByEmail(dto.email);
      if (!!user) return { user, message: "Bem vindo(a) de volta!" };
      return await prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          image: dto?.image,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      console.log({ error });
      return { error };
    }
  }

  async UpdateChatIdToUserById(userId: string, chatId: string) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        chatId,
      },
    });
  }

  async ListAllUsers(): Promise<UserDto[]> {
    return await prisma.user.findMany({});
  }

  async FindUserById(id: string): Promise<UserDto | unknown> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async FindUserByEmail(email: string): Promise<unknown> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
