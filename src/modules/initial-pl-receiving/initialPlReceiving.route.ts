import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { InitialPlReceivingController } from './initialPlReceiving.controller';

const initialPlReceivingRoute = new Hono();

const controller = new InitialPlReceivingController();

initialPlReceivingRoute.use('*', authMiddleware);

initialPlReceivingRoute.get('/', (c) => controller.getInitialPlReceiving(c));
initialPlReceivingRoute.get('/status', (c) => controller.getInitialPlReceivingStatus(c));
initialPlReceivingRoute.get('/csv-export', (c) => controller.csvExport(c));
initialPlReceivingRoute.get('/excel-export', (c) => controller.excelExport(c));

initialPlReceivingRoute.get('/filename-si_number', (c) => controller.getPlsFiles(c));
initialPlReceivingRoute.get('/branch/:branch_id/filenames', (c) => controller.plFiles(c));

export default initialPlReceivingRoute;