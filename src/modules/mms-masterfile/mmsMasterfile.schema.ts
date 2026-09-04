import { z } from 'zod'

export const CreateBranchSchema = z.object({
    branch_code: z.string(),
    branch_name: z.string(),
    warehouse_code: z.string(),
    warehouse_name: z.string(),
    store_type: z.string(),
    status: z.string(),
    env: z.string(),
});
export type CreateBranchSchemaType = z.infer<typeof CreateBranchSchema>;

export const CreateItemSchema = z.object({
    style_code: z.string(),
    style_name: z.string(),
    sku_code: z.string(),
    sku_name: z.string(),
    upc: z.string(),
    primary_vendor_code: z.string(),
    primary_vendor_name: z.string(),
    alt_vendor_code: z.string(),
    alt_vendor_name: z.string(),
    dept_code: z.string(),
    dept_name: z.string(),
    subdept_code: z.string(),
    subdept_name: z.string(),
    class_code: z.string(),
    class_name: z.string(),
    subclass_code: z.string(),
    subclass_name: z.string(),
    buying_uom: z.string(),
    color: z.string(),
    size_dimension: z.string(),
    curr_regular_retail: z.string(),
    status: z.string(),
    env: z.string(),
});
export type CreateItemSchemaType = z.infer<typeof CreateItemSchema>;


