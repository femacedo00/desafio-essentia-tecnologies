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

            // Servide da criação do usuário
            const user = await userService.create({ name, email, password });

            // Resposta de sucesso caso cadastro no banco
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
}