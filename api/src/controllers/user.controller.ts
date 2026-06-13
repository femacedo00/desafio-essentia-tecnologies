import { Request, Response } from 'express';
import { UserService } from "../services/user.service.js";
import httpStatus from 'http-status';
import { LoginSchema, RegisterSchema } from '../validators/user.validator.js';
import { ZodError } from 'zod';

const userService = new UserService();

export class UserController {
    public async register(req: Request, res: Response): Promise<void> {
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
            // Se o erro veio do validator, formata amigavelmente para o cliente
            if (error instanceof ZodError) {
                res.status(httpStatus.BAD_REQUEST).json({
                    status: "error",
                    message: "Erro de validação de dados",
                    errors: error.issues
                });
                return;
            }

            // Resposta de erro caso algum processo falhe no service
            res.status(httpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message || "Interna server error"
            })
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
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
            // Se o erro veio do validator, formata amigavelmente para o cliente
            if (error instanceof ZodError) {
                res.status(httpStatus.BAD_REQUEST).json({
                    status: "error",
                    message: "Erro de validação de dados",
                    errors: error.issues
                });
                return;
            }

            // Resposta de erro caso algum processo falhe no service
            res.status(httpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message || "Interna server error"
            })
        }
    }
}