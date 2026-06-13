// Definção de dados necessário para a criação de um usuário
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

// Definção de dados necessário para a resposta de um usuário
export interface ResponseUserDTO {
    name: string;
    email: string;
    updatedAt: string;
    createdAt: string;
    deletedAt?: string;
}

// Definção de dados necessário para o login de um usuário
export interface LoginUserDTO {
    email: string;
    password: string;
}
// Definção de dados necessário para a resposta de um usuário
export interface ResponseLoginUserDTO {
    user: ResponseUserDTO;
    token: string;
}