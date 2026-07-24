import { z } from 'zod'

export const CreateUserSchema = z.object({
    user_name: z.string(),
    password:  z.string().min(5, "Password must be at least 5 characters"),
    full_name: z.string(),
    description: z.string().nullish(),
    position: z.string(),
    email_address:  z.email(),
    mms: z.string().length(1),
    env: z.string(),
    branches: z.string(),
    status: z.string().min(1).max(8),
    business_unit: z.string().nullable(),
    created_by: z.number(),
    role_id: z.number(),
});
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

export const BulkUserUploadSchema = z.array(
    z.object({
        user_name: z.string(),
        password:  z.string().nullish(),
        full_name: z.string(),
        description: z.string().nullish(),
        position: z.string(),
        email_address:  z.email(),
        mms: z.string().length(1).nullish(),
        env: z.string().nullish(),
        branches: z.string(),
        status: z.string().min(1).max(8),
        business_unit: z.string().nullish(),
        created_by: z.number(),
        role: z.string(),
    })
);
export type BulkUserUploadSchemaType = z.infer<typeof BulkUserUploadSchema>;

export const UpdateUserSchema = z.object({
    full_name: z.string(),
    description: z.string().nullish(),
    position: z.string(),
    email_address:  z.email(),
    mms: z.string().length(1),
    env: z.string().nullable(),
    branches: z.string(),
    status: z.string().min(1).max(8),
    business_unit: z.string().nullable(),
    last_update_by: z.number(),
    role_id: z.number(),
});
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

export const AdminChangePasswordSchema = z.object({
    new_password: z.string().min(5),
    last_update_by: z.number(),
});

export type AdminChangePasswordSchemaType = z.infer<typeof AdminChangePasswordSchema>;