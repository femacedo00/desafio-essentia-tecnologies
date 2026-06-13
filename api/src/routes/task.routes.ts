import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const taskRoutes = Router();

// GET /tasks - Listar todas as tarefas
taskRoutes.get('/', authMiddleware, (req, res) => {
    const logado = req.userId;
    res.json({ message: `Usuário ${logado} acessou a rota protegida.` });
});

export default taskRoutes;