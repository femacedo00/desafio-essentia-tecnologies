// Estrutura para o banco Mongo
export interface TaskLogAttributes {
    id: number;
    taskId: number;
    userId: number;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes?: string; // Guardaremos como uma string JSON das alterações
    createdAt?: Date;
}

export interface TaskHookOptions {
    userId?: number;
}