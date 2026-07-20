import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { UserController } from './user.controller';

const userRoute = new Hono();

const controller = new UserController();

userRoute.use('*', authMiddleware);

userRoute.get('/', (c) => controller.getUsers(c));

userRoute.post('/bulk-upload', (c) => controller.bulkUpload(c));
userRoute.get('/csv-export', (c) => controller.csvExport(c));
userRoute.get('/excel-export', (c) => controller.excelExport(c));

userRoute.get('/:user_id', (c) => controller.getUserById(c));
userRoute.post('/', (c) => controller.createUser(c));
userRoute.put('/:user_id', (c) => controller.updateUser(c));
userRoute.delete('/:user_id', (c) => controller.deleteUser(c));
userRoute.patch('/:user_id/change-password', (c) => controller.changeUserPassword(c));
userRoute.get('/:user_id/user-history', (c) => controller.userHistory(c));


export default userRoute;