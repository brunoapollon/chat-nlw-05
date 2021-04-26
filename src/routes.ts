import {response, Router} from "express";
import { getCustomRepository } from "typeorm";
import { MessageController } from "./controllers/MessagesController";
import { SettingsController } from "./controllers/SettingsController";
import { UsersController } from "./controllers/UsersController";

const routes = Router();
const settingsController = new SettingsController();
const usersController = new UsersController();
const messageController = new MessageController();
routes.post("/settings", settingsController.create);
routes.get("/settings/:username", settingsController.findByUsername);
routes.put("/settings/:username", settingsController.update);



routes.post("/users", usersController.create);



routes.post("/messages", messageController.create);
routes.get("/messages/:id", messageController.showByUser);
export { routes };