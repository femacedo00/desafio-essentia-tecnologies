import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const userRoutes = Router();
const userController = new UserController();

// POST /users/register - Rota de cadastro de usuário
userRoutes.post('/register', userController.register);

// POST /users/login - Rota de login de usuário
userRoutes.post('/login', userController.login);

export default userRoutes;