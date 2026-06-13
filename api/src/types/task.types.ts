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
