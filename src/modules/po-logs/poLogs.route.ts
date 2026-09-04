import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { PoLogsController } from './poLogs.controller';

const poLogsRoute = new Hono();

const controller = new PoLogsController();

// poLogsRoute.use('*', authMiddleware);

poLogsRoute.get('/', (c) => controller.getPoLogs(c));
poLogsRoute.get('/status', (c) => controller.getPoLogsStatus(c));
poLogsRoute.get('/csv-export', (c) => controller.csvExport(c));
poLogsRoute.get('/excel-export', (c) => controller.excelExport(c));

export default poLogsRoute;