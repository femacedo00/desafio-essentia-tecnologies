import { Optional } from "sequelize";

export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

// Definição dos atributos opcionais na criação (id é gerado automaticamente)
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }