import { z } from 'zod';

// Esquema estrito para o cadastro
export const RegisterSchema = z.object({
    name: z
        .string({ message: "Nome é obrigatório" })
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .max(64, "O nome não pode passar de 64 caracteres")
        .trim(),

    email: z
        .string({ message: "E-mail é obrigatório" })
        .email("Formato de e-mail inválido")
        .trim()
        .toLowerCase(),

    password: z
        .string({ message: "Senha é obrigatória" })
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .max(32, "A senha não pode passar de 32 caracteres")
});