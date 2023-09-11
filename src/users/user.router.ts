import { Router } from "express";
import { UserController } from "./user.controller";

const router: Router = Router();

const userController = new UserController();

export const UserRouter = (): Router => {
  router.post("/", userController.CreateUser);
  router.get("/", userController.ListAllUsers);
  return router;
};
