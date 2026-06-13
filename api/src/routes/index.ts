import { Router } from "express";
import taskRoutes from "./task.routes.js";

const routes = Router();

/* CENTRALIZADOR DE ROTAS DA API */
routes.use('/tasks', taskRoutes);

export default routes;