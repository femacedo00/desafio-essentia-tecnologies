import { z } from 'zod';

const title = z
    .string({ message: "O título é obrigatório" })
    .min(3, { message: "O título deve ter pelo menos 3 caracteres" })
    .max(128, { message: "O título não pode passar de 128 caracteres" })
    .trim();

const description = z
    .string()
    .trim()
    .optional();

const completed = z
    .boolean({ message: "O campo completed deve ser um booleano" })
    .optional();

export const CreateTaskSchema = z.object({
    title,
    description
});

export const UpdateTaskSchema = z.object({
    title,
    description,
    completed
}).partial();