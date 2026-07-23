import { z } from 'zod'

export const CreateRoleSchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    level: z.number(),
    default_dashboard: z.string().nullable(),
    created_by:  z.number(),
    // created_date: z.date(),
    menu_ids: z.array(z.union([z.string(), z.number()])),
});

export const UpdateRoleSchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    level: z.number(),
    default_dashboard: z.string().nullable(),
    last_update_by:  z.number(),
    // last_update_date: z.date(),
    menu_ids: z.array(z.union([z.string(), z.number()])),
});

export type CreateRoleSchemaType = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleSchemaType = z.infer<typeof UpdateRoleSchema>;