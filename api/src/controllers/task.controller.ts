import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { TaskService } from '../services/task.service.js';
import { CreateTaskSchema, UpdateTaskSchema } from '../validators/task.validator.js';

const taskService = new TaskService();

export class TaskController {
    // Criar Tarefa
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Valida o corpo da requisição
            const validatedData = CreateTaskSchema.parse(req.body);

            const userId = req.userId!;

            const task = await taskService.create({
                ...validatedData,
                userId
            });

            res.status(httpStatus.CREATED).json({
                status: 'success',
                data: { task }
            });
        } catch (error) {
            next(error);
        }
    }

    // Listar todas as tarefas do usuário logado
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const tasks = await taskService.getAll(userId);

            res.status(httpStatus.OK).json({
                status: 'success',
                data: { tasks }
            });
        } catch (error) {
            next(error);
        }
    }

    // Atualizar Tarefa
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = UpdateTaskSchema.parse(req.body);
            const userId = req.userId!;
            const taskId = Number(req.params.id);

            const updatedTask = await taskService.update({
                id: taskId,
                data: validatedData,
                userId
            });

            res.status(httpStatus.OK).json({
                status: 'success',
                data: { task: updatedTask }
            });
        } catch (error) {
            next(error);
        }
    }

    // Deletar Tarefa
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const taskId = Number(req.params.id);

            await taskService.delete({
                id: taskId,
                userId
            });

            res.status(httpStatus.OK).json({
                status: 'success',
                message: 'Tarefa deletada com sucesso.'
            });
        } catch (error) {
            next(error);
        }
    }

    // Histórico de uma determinada tarefa
    public async getLog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.userId!;
            const taskId = Number(req.params.id); // Pega o ID da tarefa vindo da URL

            const log = await taskService.getLog({ taskId, userId });

            res.status(httpStatus.OK).json({
                status: 'success',
                data: { log }
            });
        } catch (error) {
            next(error);
        }
    }
}