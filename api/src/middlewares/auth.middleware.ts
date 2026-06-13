import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { TokenPayload } from '../types/auth.types.js';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    // Verificar se o cabeçalho Authorization foi enviado
    if (!authHeader) {
        res.status(httpStatus.UNAUTHORIZED).json({
            status: "error",
            message: "Token não fornecido."
        });
        return;
    }

    // O formato padrão do cabeçalho é: "Bearer STRING_DO_TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        res.status(httpStatus.UNAUTHORIZED).json({
            status: "error",
            message: "Erro no formato do token."
        });
        return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        res.status(httpStatus.UNAUTHORIZED).json({
            status: "error",
            message: "Token mal formatado."
        });
        return;
    }

    // Validar o Token JWT
    const secret = process.env.JWT_SECRET || "default_secret";

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;

        // Injetar o ID do usuário na requisição para os próximos controllers usarem
        req.userId = decoded.id;

        // Passa para o próximo middleware ou controller da rota
        next();
    } catch (err) {
        res.status(httpStatus.UNAUTHORIZED).json({
            status: "error",
            message: "Token inválido ou expirado."
        });
    }
};