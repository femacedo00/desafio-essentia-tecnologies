import User from "../models/user.model.js";
import { CreateUserDTO, LoginUserDTO, ResponseLoginUserDTO, ResponseUserDTO } from "../dtos/user.dtos.js";
import jwt from "jsonwebtoken";

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

        // Retorna o usuário no formato JSON sem o id e a senha
        return newUser.toJSON();
    }

    public async login(credentials: LoginUserDTO): Promise<ResponseLoginUserDTO> {
        const { email, password } = credentials;

        // Verificar se o usuário existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("E-mail incorreto.");
        }

        // Verificar se senha de login é a mesma do banco de dados
        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            throw new Error("Senha incorreta.");
        }

        // Gerar o JWT 
        const secret = process.env.JWT_SECRET || "default_secret";

        const token = jwt.sign(
            { id: user.id },
            secret,
            { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any }
        );

        // Retorna o usuário no formato JSON
        const userResponse = user.toJSON();

        return {
            user: userResponse,
            token
        };
    }
}