import { Router } from "express";
import taskRoutes from "./task.routes.js";
import userRoutes from "./user.routes.js";

const routes = Router();

/* CENTRALIZADOR DE ROTAS DA API */
routes.use('/tasks', taskRoutes);
routes.use('/users', userRoutes);

export default routes;