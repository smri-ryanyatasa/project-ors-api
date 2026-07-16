import { Context } from "hono";
import { UserService } from "./user.service";
import { CreateUserSchema, UpdateUserSchema } from "./user.schema";

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

}
