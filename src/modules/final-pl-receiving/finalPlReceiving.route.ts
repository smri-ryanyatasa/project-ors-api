import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { FinalPlReceivingController } from './finalPlReceiving.controller';

const finalPlReceivingRoute = new Hono();

const controller = new FinalPlReceivingController();

finalPlReceivingRoute.use('*', authMiddleware);

finalPlReceivingRoute.get('/', (c) => controller.getFinalPlReceiving(c));
finalPlReceivingRoute.get('/status', (c) => controller.getFinalPlReceivingStatus(c));
finalPlReceivingRoute.get('/csv-export', (c) => controller.csvExport(c));
finalPlReceivingRoute.get('/excel-export', (c) => controller.excelExport(c));
finalPlReceivingRoute.put('/rows-update', (c) => controller.rowsUpdate(c));
finalPlReceivingRoute.get('/to-approved', (c) => controller.toApproved(c));

export default finalPlReceivingRoute;