import { Context } from "hono";
import ExcelJS from 'exceljs';

import { UserService } from "./user.service";
import { CreateUserSchema, UpdateUserSchema, AdminChangePasswordSchema, BulkUserUploadSchema } from "./user.schema";

export class UserController {
    private service = new UserService();

    async getUsers(c: Context): Promise<Response> {
        const page = Number(c.req.query('page') || 1);
        const pageSize = Number(c.req.query('pageSize') || 5);
        const search = c.req.query('search') || '';
        const filterModelParam = c.req.query('filterModel');
        const sortModelParam = c.req.query('sortModel');

        const filterModel = filterModelParam
        ? JSON.parse(filterModelParam)
        : [];
        
        const sortModel = sortModelParam
        ? JSON.parse(sortModelParam)
        : [];

        const users = await this.service.getUsers({page, pageSize, search, filterModel, sortModel});

        return c.json(users);
    }
    
    async getUserById(c: Context): Promise<Response> {
        const userId = Number(c.req.param('user_id'));

        const user = await this.service.getUser(userId);

        return c.json(user);
    }

    async createUser(c: Context): Promise<Response> {
        try {
            const body = await c.req.json();

            const result = CreateUserSchema.safeParse(body);

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

            const user = await this.service.createUser(result.data);

            return c.json(
                {
                    status: 'success',
                    data: user,
                },
                201
            );
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Username already exists.'
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

    async updateUser(c: Context): Promise<Response> {
        try {
            const userId = Number(c.req.param('user_id'));

            const body = await c.req.json();

            const result = UpdateUserSchema.safeParse(body);

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

            const user = await this.service.updateUser(
                userId,
                result.data
            );

            return c.json(user);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Username not found.'
            ) {
                return c.json(
                    {
                        status: 'error',
                        message: error.message,
                    },
                    404
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

    async deleteUser(c: Context): Promise<Response> {
       
        try {
            const userId = Number(c.req.param('user_id'));

            const user = await this.service.deleteUser(userId);

            return c.json(user);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Username not found.'
            ) {
                return c.json(
                    {
                        status: 'error',
                        message: error.message,
                    },
                    404
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

    async changeUserPassword(c: Context): Promise<Response> {
        const userId = Number(c.req.param('user_id'));

        const body = await c.req.json();

        const result = AdminChangePasswordSchema.safeParse(body);

        if (!result.success) {
            return c.json(
            {
                status: 'error',
                message: 'Validation failed.',
                data: result.error.flatten(),
            }, 400);
        }

        const user = await this.service.changeUserPassword(userId, result.data);

        return c.json(user);
    }

    async userHistory(c: Context): Promise<Response> {
        const userId = Number(c.req.param('user_id'));

        const history = await this.service.userHistory(userId);

        return c.json(history)
    }

    async bulkUpload(c: Context): Promise<Response> {
        const body = await c.req.json();

        const result = BulkUserUploadSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                row: issue.path[0],
                field: issue.path[1],
                message: issue.message,
            }));

            return c.json({
                message: 'Validation failed',
                errors,
            }, 400);
        }
        
        const upload = await this.service.bulkUpload(result.data);

        if (!upload.success) {
             return c.json({
                status: 'error',
                message: upload.message,
                usernames: upload.usernames
            }, 400);    
        }

        return c.json(upload);
    }

    async csvExport(c: Context): Promise<Response> {
        const search = c.req.query('search') || '';

        const filterModelParam = c.req.query('filterModel');
        const sortModelParam = c.req.query('sortModel');

        const filterModel = filterModelParam
            ? JSON.parse(filterModelParam)
            : [];

        const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];

        const users = await this.service.csvExport({
            search,
            filterModel,
            sortModel,
        });
        console.log(users)
        const headers = [
            'User ID',
            'Username',
            'Full Name',
            'Role',
            'Description',
            'Position',
            'Email Address',
            'MMS',
            'Environment',
            'Branches',
            'Status',
            'Business Unit',
        ];

        const csvRows = [
            headers.join(','),
            ...users.map((user) =>
                [
                    user.user_id,
                    user.user_name,
                    user.full_name,
                    user.role_name,
                    user.description,
                    user.position,
                    user.email_address,
                    user.mms,
                    user.env,
                    user.branches,
                    user.status,
                    user.business_unit,
                ]
                    .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
                    .join(',')
            ),
        ];

        const csv = csvRows.join('\n');

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="users.csv"',
            },
        });
    }

    async excelExport(c: Context): Promise<Response> {
        const search = c.req.query('search') || '';

        const filterModelParam = c.req.query('filterModel');
        const sortModelParam = c.req.query('sortModel');

        const filterModel = filterModelParam
            ? JSON.parse(filterModelParam)
            : [];

        const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];

        const users = await this.service.excelExport({
            search,
            filterModel,
            sortModel,
        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('Users');

        worksheet.columns = [
            { header: 'User ID', key: 'user_id', },
            { header: 'Username', key: 'user_name', },
            { header: 'Full Name', key: 'full_name', },
            { header: 'Role', key: 'role_name', },
            { header: 'Description', key: 'description',},
            { header: 'Position', key: 'position', },
            { header: 'Email', key: 'email_address', },
            { header: 'From MMS?', key: 'mms', },
            { header: 'Environment', key: 'env', },
            { header: 'Branches', key: 'branches', },
            { header: 'Status', key: 'status', },
            { header: 'Business Unit', key: 'bussiness_unit', width: 30, },
        ];

        worksheet.addRows(users);

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Content-Disposition':
                    'attachment; filename="users.xlsx"',
            },
        });
    }

    async getBranches(c: Context): Promise<Response> {
        try {
            const branches = await this.service.getBranches();

            return c.json(branches);
        } catch(error) {
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
