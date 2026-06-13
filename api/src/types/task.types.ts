import { Optional } from "sequelize";

// Estrutura para o banco MySQL
export interface TaskAttributes {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

// Definição dos atributos opcionais na criação (id é gerado automaticamente)
export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'completed'> { }

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