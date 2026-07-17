import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z.object({
    current_password: z.string().min(1),
    new_password: z.string().min(8),
});

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>;