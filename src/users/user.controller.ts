import { Request, Response } from "express";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  async CreateUser(req: Request, res: Response) {
    const result = await userService.CreateUser(req.body);
    if (!result) return res.status(400).json({ error: result });
    return res.status(200).json(result).end();
  }

  async ListAllUsers(req: Request, res: Response) {
    const result = await userService.ListAllUsers();
    return res.status(200).json(result).end();
  }
}
