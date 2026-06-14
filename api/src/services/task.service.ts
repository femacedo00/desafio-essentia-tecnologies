import { CreateTaskDTO, IdsTaskDTO, ID, UpdateTaskDTO, ResponseTaskDTO, TaskLogResponseDTO, IdsLogTaskDTO } from '../dtos/task.dtos.js';
import { TaskModel } from '../models/task.model.js';
import { TaskLog } from '../schemas/task-log.schema.js';

export class TaskService {
    // Criar tarefa vinculada ao usuário logado
    public async create(taskData: CreateTaskDTO): Promise<ResponseTaskDTO> {
        const newTask = await TaskModel.create(taskData as any);
        return newTask.toJSON();
    }

    // Listar apenas as tarefas do usuário logado
    public async getAll(userId: ID): Promise<ResponseTaskDTO[]> {
        const tasks = await TaskModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']] // Opcional: traz as mais recentes primeiro
        });

        return tasks.map(task => task.toJSON() as ResponseTaskDTO);
    }

    // Buscar uma tarefa específica (garantindo que pertence ao usuário)
    public async getById(taskData: IdsTaskDTO): Promise<TaskModel> {
        const task = await TaskModel.findOne({ where: taskData });
        if (!task) throw new Error("Tarefa não encontrada.");
        return task;
    }

    // Atualizar tarefa
    public async update(taskData: UpdateTaskDTO): Promise<ResponseTaskDTO> {
        const task = await this.getById({
            id: taskData.id,
            userId: taskData.userId
        });

        const updatedTask = await task.update(taskData.data);
        return updatedTask.toJSON();
    }

    // Deletar tarefa
    public async delete(taskData: IdsTaskDTO): Promise<boolean> {
        const task = await this.getById(taskData);
        await task.destroy();
        return true;
    }

    // Busca o histórico de uma determinada tarefa
    public async getLog(logData: IdsLogTaskDTO): Promise<TaskLogResponseDTO[]> {
        // Busca os logs filtrando por taskId e userId
        const logs = await TaskLog.find(logData)
            .sort({ createdAt: -1 }) // Traz os logs mais recentes primeiro
            .lean(); // retorna objetos JS puros

        // Mapeia e formata os registros
        return logs.map(log => ({
            id: String(log._id),
            taskId: log.taskId,
            userId: log.userId,
            action: log.action,
            changes: log.changes,
            createdAt: log.createdAt.toISOString()
        }));
    }
}