import { Context } from "hono";
import { UserService } from "./user.service";
import { CreateUserSchema, UpdateUserSchema, AdminChangePasswordSchema, BulkUserUploadSchema } from "./user.schema";

export class UserController {
    private service = new UserService();

    async getUsers(c: Context): Promise<Response> {
        const users = await this.service.getUsers();

        return c.json(users);
    }
    
    async getUserById(c: Context): Promise<Response> {
        const userId = Number(c.req.param('user_id'));

        const user = await this.service.getUser(userId);

        return c.json(user);
    }

    async createUser(c: Context): Promise<Response> {
        const body = await c.req.json();
        
        const result = CreateUserSchema.safeParse(body);
        
        if (!result.success) {
            return c.json(
            {
                status: 'error',
                message: 'Validation failed.',
                data: result.error.flatten(),
            },  400);
        }
        
        const user = await this.service.createUser(result.data);

         if (user.status === 'error') {
            return c.json({
                message: user.message,
            }, 400);
        }

        return c.json(user);
    }

    async updateUser(c: Context): Promise<Response> {
        const userId = Number(c.req.param('user_id'));
        const body = await c.req.json();

        const result = UpdateUserSchema.safeParse(body);

        if (!result.success) {
            return c.json(
            {
                status: 'error',
                message: 'Validation failed.',
                data: result.error.flatten(),
            }, 400);
        }

        const user = await this.service.updateUser(userId,  result.data);

        return c.json(user);
    }

    async deleteUser(c: Context): Promise<Response> {
        const userId = Number(c.req.param('user_id'));

        const user = await this.service.deleteUser(userId);

        return c.json(user);
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

}
