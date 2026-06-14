import { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/user.service.js";
import httpStatus from 'http-status';
import { LoginSchema, RegisterSchema } from '../validators/user.validator.js';

const userService = new UserService();

export class UserController {
    // Craiação de um usuário
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validação de entrada
            const validateData = RegisterSchema.parse(req.body);

            // Service da criação do usuário
            const user = await userService.create(validateData);

            // Resposta de sucesso no cadastrado do usuário no banco
            res.status(httpStatus.CREATED).json({
                status: "success",
                data: user
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Autenticação de um usuário
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validação de entrada
            const validateData = LoginSchema.parse(req.body);

            // Service da criação do usuário
            const result = await userService.login(validateData);

            // Resposta de sucesso no login
            res.status(httpStatus.OK).json({
                status: "success",
                data: result
            });

        } catch (error: any) {
            next(error);
        }
    }
}