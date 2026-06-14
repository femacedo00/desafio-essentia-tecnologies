// Estrutura para o banco Mongo
export interface ITaskLog {
    taskId: number;
    userId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: Record<string, any>;
    createdAt: Date;
}