import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { AuthController } from './auth.controller';

const authRoute = new Hono();

const controller = new AuthController();

authRoute.post('/login', (c) => controller.login(c));
authRoute.patch('/password', authMiddleware, (c) => controller.changePassword(c));
authRoute.get('/me', authMiddleware, (c) => controller.getCurrentUser(c));

export default authRoute;