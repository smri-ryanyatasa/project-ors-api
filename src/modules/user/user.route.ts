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
userRoute.get('/branches', (c) => controller.getBranches(c));
userRoute.get('/assigned-branch', (c) => controller.getAssignedBranch(c));
userRoute.get('/mms-users', (c) => controller.getMMSUsers(c));
userRoute.post('/create-mms-users', (c) => controller.createMmsUser(c));
userRoute.get('/save-filter', (c) => controller.getSaveFilter(c));
userRoute.post('/save-filter', (c) => controller.saveFilter(c));

userRoute.get('/:user_id', (c) => controller.getUserById(c));
userRoute.post('/', (c) => controller.createUser(c));
userRoute.put('/:user_id', (c) => controller.updateUser(c));
userRoute.delete('/:user_id', (c) => controller.deleteUser(c));
userRoute.patch('/:user_id/change-password', (c) => controller.changeUserPassword(c));
userRoute.get('/:user_id/user-history', (c) => controller.userHistory(c));

userRoute.delete('/save-filter/:filter_id', (c) => controller.deleteSaveFilter(c));
userRoute.put('/save-filter/:filter_id', (c) => controller.updateSaveFilter(c));


export default userRoute;