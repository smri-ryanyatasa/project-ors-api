import { Context } from "hono";
import ExcelJS from 'exceljs';

import { MmsMasterfileService } from "./mmsMasterfile.service";
import { CreateBranchSchema, CreateItemSchema } from "./mmsMasterfile.schema";


export class MmsMasterfileController {
    private service = new MmsMasterfileService();

    async getMmsMasterfile(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const sourceTable = c.req.query('sourceTable') as string;
            const targetTable = c.req.query('targetTable') as string;

            const response = await this.service.getMmsMasterfile({
                user_name, 
                sourceTable, 
                targetTable
            });

            return c.json(response);

        }  catch(error) {
            console.log(error);
            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async createBranch(c: Context): Promise<Response> {
        try {
            const body = await c.req.json();

            const result = CreateBranchSchema.safeParse(body);

            if (!result.success) {
                return c.json(
                    {
                        status: 'error',
                        message: 'Validation failed.',
                        data: result.error.flatten(),
                    },
                    400
                );
            }

            const branch = await this.service.createBranch(result.data);

            return c.json(
                {
                    status: 'success',
                    data: branch,
                },
                201
            );
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Branch already exists.'
            ) {
                return c.json(
                    {
                        status: 'error',
                        message: error.message,
                    },
                    409
                );
            }

            console.error(error);

            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async createItem(c: Context): Promise<Response> {
        try {
            const body = await c.req.json();

            const result = CreateItemSchema.safeParse(body);

            if (!result.success) {
                return c.json(
                    {
                        status: 'error',
                        message: 'Validation failed.',
                        data: result.error.flatten(),
                    },
                    400
                );
            }

            const item = await this.service.createItem(result.data);

            return c.json(
                {
                    status: 'success',
                    data: item,
                },
                201
            );
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Item already exists.'
            ) {
                return c.json(
                    {
                        status: 'error',
                        message: error.message,
                    },
                    409
                );
            }

            console.error(error);

            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }
}