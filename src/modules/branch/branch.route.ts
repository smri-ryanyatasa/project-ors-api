import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { BranchController } from './branch.controller';

const branchRoute = new Hono();

const controller = new BranchController();

branchRoute.use('*', authMiddleware);

branchRoute.get('/', (c) => controller.getBranches(c));
branchRoute.get('/csv-export', (c) => controller.csvExport(c));
branchRoute.get('/excel-export', (c) => controller.excelExport(c));

export default branchRoute;