import { Request, Response } from 'express';
import { UserService } from "../services/user.service.js";
import httpStatus from 'http-status';

const userService = new UserService();

export class UserController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            // Validação de entrada
            if (!name || !email || !password) {
                // Resposta de erro caso haja campo(s) obrigatório(s) ausentes 
                res.status(httpStatus.BAD_REQUEST).json({
                    message: "Campos obrigatórios ausentes"
                })
                return;
            }

            // Service da criação do usuário
            const user = await userService.create({ name, email, password });

            // Resposta de sucesso no cadastrado do usuário no banco
            res.status(httpStatus.CREATED).json({
                status: "success",
                data: user
            });
        } catch (error: any) {
            // Resposta de erro caso algum processo falhe
            res.status(httpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message || "Interna server error"
            })
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validação de entrada
            if (!email || !password) {
                // Resposta de erro caso haja campo(s) obrigatório(s) ausentes 
                res.status(httpStatus.BAD_REQUEST).json({
                    message: "Campos obrigatórios ausentes"
                })
                return;
            }

            // Service da criação do usuário
            const result = await userService.login({ email, password });

            // Resposta de sucesso no login
            res.status(httpStatus.OK).json({
                status: "success",
                data: result
            });

        } catch (error: any) {
            // Resposta de erro caso algum processo falhe
            res.status(httpStatus.BAD_REQUEST).json({
                status: "error",
                message: error.message || "Interna server error"
            })
        }
    }
}