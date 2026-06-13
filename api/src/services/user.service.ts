import User from "../models/user.model.js";
import { CreateUserDTO, ResponseUserDTO } from "../dtos/user.dtos.js";

export class UserService {
    public async create(userData: CreateUserDTO): Promise<ResponseUserDTO> {
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