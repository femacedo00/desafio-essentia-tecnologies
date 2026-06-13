import User from "../models/user.model.js";

// Definção de dados necessário para a criação de um usuário
interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export class UserService {
    public async create(userData: CreateUserDTO) {
        const { email } = userData;

        // Impedir e-mails duplicados
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            throw new Error("E-mail já está em uso.");
        }

        // Cria o usuário
        const newUser = await User.create(userData as any);

        // Retorna o usuário sem o id e a senha no formato JSON
        const userResponse = newUser.toJSON();
        delete userResponse.password;
        delete userResponse.id;

        return userResponse;
    }
}