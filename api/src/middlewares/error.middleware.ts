import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import httpStatus from 'http-status';

// No Express, middlewares de erro DEVEM receber 4 argumentos explicitamente
export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    //   Se o erro veio do Zod (Validação)
    if (error instanceof ZodError) {
        res.status(httpStatus.BAD_REQUEST).json({
            status: "error",
            message: "Erro de validação de dados",
            errors: error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
        return;
    }

    // Erro Genérico
    res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        message: error.message || "Internal server error"
    });
};