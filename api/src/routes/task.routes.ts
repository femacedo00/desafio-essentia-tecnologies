import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const taskRoutes = Router();
const taskController = new TaskController();

// Aplica o middleware de autenticação para todas as rotas abaixo
taskRoutes.use(authMiddleware);

// POST /tasks/register - Rota de cadastro da tarefa
taskRoutes.post('/', taskController.create);

// GET /tasks/listen - Rota de listegem de todas as tarefas
taskRoutes.get('/', taskController.getAll);

// PATCH /tasks/{id} - Rota de atualização de uma tarefa específica
taskRoutes.patch('/:id', taskController.update);

// DELETE /tasks/{id} - RRota de exclusão de uma tarefa específica
taskRoutes.delete('/:id', taskController.delete);

export default taskRoutes;