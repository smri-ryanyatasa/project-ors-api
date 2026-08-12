import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { PlMasterfileController } from './plMasterfile.controller';

const plMasterfileRoute = new Hono();

const controller = new PlMasterfileController();

plMasterfileRoute.use('*', authMiddleware);

plMasterfileRoute.get('/', (c) => controller.getPlMasterfile(c));
plMasterfileRoute.get('/status', (c) => controller.getPlMasterfileStatus(c));
plMasterfileRoute.get('/csv-export', (c) => controller.csvExport(c));
plMasterfileRoute.get('/excel-export', (c) => controller.excelExport(c));

export default plMasterfileRoute;