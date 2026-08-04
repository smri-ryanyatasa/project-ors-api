import { z } from 'zod'

export const SourceFileSchema = z.object({
    filename: z.string(),
    vendor_code: z.number(),
    si_number: z.union([z.string(), z.number()]),
    branch_code: z.number(),
    file_size: z.number(),
    env: z.string(),
    uploaded_by: z.number(),
    // uploaded_attempts: z.number(),
    row_count: z.number(),
    created_by: z.number(),
    // tran_type: z.number(),
    // status: z.number(),
    // result: z.string(),
});
export type SourceFileSchemaType = z.infer<typeof SourceFileSchema>;

export const PlUploadRowSchema = z.object({
  document_no: z
    .coerce
    .string()
    .regex(
        /^[a-zA-Z0-9]+$/,
        'Special characters are not allowed.'
    )
    .max(30, 'Must not exceed 30 characters.')
    .optional()
    .or(z.literal('')),

  sales_invoice_no: z
    .coerce
    .string()
    .regex(
        /^[a-zA-Z0-9]+$/,
        'Special characters are not allowed.'
    )
    .nonempty('is required.')
    .max(30, 'Must not exceed 30 characters.'),

  ship_to_code: z
    .coerce
    .string()
    .regex(
        /^[a-zA-Z0-9]+$/,
        'Special characters are not allowed.'
    )
    .max(30, 'Must not exceed 30 characters.')
    .optional()
    .or(z.literal('')),

  consignee: z
    .coerce
    .string()
    .nonempty('is required.')
    .max(50, 'Must not exceed 50 characters.'),

  uom: z
    .coerce
    .string()
    .regex(
        /^[a-zA-Z0-9]+$/,
        'Special characters are not allowed.'
    )
    .max(10, 'Must not exceed 10 characters.')
    .optional()
    .or(z.literal('')),

  material: z
    .coerce
    .string()
    .nonempty('is required.')
    .max(30, 'Must not exceed 30 characters.'),

  size: z
    .coerce
    .string()
    .nonempty('is required.')
    .max(10, 'Must not exceed 10 characters.'),

  description: z
    .coerce
    .string()
    .nonempty('is required.')
    .max(50, 'Must not exceed 50 characters.'),

  served_qty: z.preprocess(
    (value) => value === '' ? undefined : value,
    z.number({
        error: 'Served Qty is required.',
    })
        .int('Served Qty must be a whole number.')
        .refine((value) => value.toString().length <= 10, {
        message: 'Must not exceed 10 digits.',
        })
    ),

  carton_qty: z
    .coerce
    .number()
    .max(4, 'Must not exceed 4 digits.')
    .int('Served Qty must be a whole number.')
    .optional(),

  branch_code: z.preprocess(
    (value) => value === '' ? undefined : value,
        z.coerce
        .number({
            error: 'is required.',
        })
        .int('Must be a whole number.')
        .refine((value) => value.toString().length <= 4, {
            message: 'Must not exceed 4 digits.',
        })
    ),

  vendor_code: z
    .coerce
    .number()
    .refine((value) => value.toString().length <= 6, {
        message: 'Must not exceed 6 digits.',
    })
    .int('Served Qty must be a whole number.'),
});