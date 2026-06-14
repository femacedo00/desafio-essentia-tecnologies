import { ResponseDefault } from './task.model';

// Define a estrutura completa de um histórico de tarefa
export interface TaskLog {
    id: string;
    taskId: number;
    userId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: any;
    createdAt: string;
}

// Define a estrutura padrão de uma resposta da api de listagem de históricos de tarefas
export type ResponseTaskLogs = ResponseDefault & {
    data: {
        log: TaskLog[];
    }
};