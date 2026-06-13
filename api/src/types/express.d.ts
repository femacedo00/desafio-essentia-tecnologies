import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: number; // Injeta a propriedade userId opcional em todas as requisições
        }
    }
}