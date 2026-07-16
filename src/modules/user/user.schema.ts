import { z } from 'zod'

export const CreateUserSchema = z.object({
    user_name: z.string(),
    password:  z.string().min(4, "Password must be at least 4 characters"),
    full_name: z.string(),
    description: z.string().nullable(),
    position: z.string(),
    email_address:  z.email(),
    mms: z.string().length(1),
    env: z.string(),
    branches: z.string(),
    status: z.string().min(1).max(3),
    business_unit: z.string().nullable(),
    created_by: z.number(),
});
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
    full_name: z.string(),
    description: z.string().nullable(),
    position: z.string(),
    email_address:  z.email(),
    mms: z.string().length(1),
    env: z.string(),
    branches: z.string(),
    status: z.string().min(1).max(3),
    business_unit: z.string().nullable(),
    last_update_by: z.number(),
});
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;