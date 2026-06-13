// Definção de dados necessário para a resposta de um usuário
export interface ResponseUserDTO {
    name: string;
    email: string;
    updatedAt: string;
    createdAt: string;
}

// Definção de dados necessário para a criação de um usuário
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}