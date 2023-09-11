import { UserDto } from "../../users/dto/user.dto";

export interface MessageDto {
  id: string;
  chatId?: string;
  author?: UserDto;
  authorId: string;
  text: string;
  timestamp?: Date;
  error?: unknown;
}
