// Estrutura para o banco Mongo
export interface ITaskLog {
    taskId: number;
    userId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: Record<string, any>; // No Mongo salvamos como objeto puro, não precisa de JSON.stringify!
    createdAt: Date;
}

export interface TaskHookOptions {
    userId?: number;
}