// Define a estrutura de credenciais aceitas na autenticação
export interface LoginCredentials {
    email: string;
    password: string;
}

// Define a estrutura de credenciais aceitas no registro do novo usuário
export type RegisterCredentials = LoginCredentials & { name: string }

// Define a estrutura de resposta esperada da API após uma autenticação
export interface AuthResponse {
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        token: string;
    };
}

// Define a estrutura de resposta esperada da API após o registro do novo usuário
export type RegisterResponse = Omit<AuthResponse, 'user.token'>