export interface UserDto {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
}
