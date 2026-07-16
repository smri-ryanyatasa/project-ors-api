import { Hono } from 'hono';

import { UserController } from './user.controller';

const userRoute = new Hono();

// Provide a default placeholder for constructor dependencies to satisfy TypeScript
const controller = new UserController();

userRoute.get('/', (c) => controller.getUsers(c));
userRoute.get('/:user_id', (c) => controller.getUserById(c));
userRoute.post('/', (c) => controller.createUser(c));
userRoute.put('/:user_id', (c) => controller.updateUser(c));
userRoute.delete('/:user_id', (c) => controller.deleteUser(c));

export default userRoute;