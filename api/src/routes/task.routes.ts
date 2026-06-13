import { Router } from "express";

const taskRoutes = Router();

// GET /tasks - Listar todas as tarefas
taskRoutes.get('/', (_, res) => {
    res.json({ message: "Listar tarefas" });
});

export default taskRoutes;