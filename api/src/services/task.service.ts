import { TaskModel } from '../models/task.model.js';

export class TaskService {
    // Criar tarefa vinculada ao usuário logado
    public async create(data: { title: string; description?: string }, userId: number) {
        return await TaskModel.create({ ...data, userId });
    }

    // Listar apenas as tarefas do usuário logado
    public async getAll(userId: number) {
        return await TaskModel.findAll({ where: { userId } });
    }

    // Buscar uma tarefa específica (garantindo que pertence ao usuário)
    public async getById(id: number, userId: number) {
        const task = await TaskModel.findOne({ where: { id, userId } });
        if (!task) throw new Error("Tarefa não encontrada.");
        return task;
    }

    // Atualizar tarefa
    public async update(id: number, data: any, userId: number) {
        const task = await this.getById(id, userId);
        return await task.update(data);
    }

    // Deletar tarefa
    public async delete(id: number, userId: number) {
        const task = await this.getById(id, userId);
        await task.destroy();
        return true;
    }
}