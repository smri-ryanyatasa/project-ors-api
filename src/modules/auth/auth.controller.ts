import { Context } from "hono";
import { AuthService } from "./auth.service";
import { LoginSchema, ChangePasswordSchema } from "./auth.schema";

export class AuthController {
    private service = new AuthService();

    async login(c: Context): Promise<Response> {
        const body = await c.req.json();

        const result = LoginSchema.safeParse(body);

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

        const data = await this.service.login(result.data);
        
         if (!data.success) {
            return c.json({
                message: data.message,
            }, 401);
        }

        return c.json(data)
    }

    async changePassword(c: Context): Promise<Response> {
        const body = await c.req.json(); 

        const result = ChangePasswordSchema.safeParse(body);

         if (!result.success) {
            return c.json({
                status: 'error',
                message: 'Validation failed.',
                data: result.error.flatten(),
            }, 400);
        }

        const user = c.get('user');

        const newPass = await this.service.changePassword(user.user_id, result.data);

        return c.json(newPass);
    }

    async getCurrentUser(c: Context): Promise<Response> {
        const user = c.get('user') as {
            user_id: number;
            user_name: string;
        };

        const currentUser = await this.service.getCurrentUser(
            user.user_id
        );

        if (!currentUser) {
            return c.json({
                message: 'User not found.',
            }, 404);
        }

        return c.json(currentUser);
    }
}