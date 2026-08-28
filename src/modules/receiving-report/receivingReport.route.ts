import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { ReceivingReportController } from './receivingReport.controller';

const receivingReportRoute = new Hono();

const controller = new ReceivingReportController();

receivingReportRoute.use('*', authMiddleware);

receivingReportRoute.get('/', (c) => controller.getReceivingReport(c));
receivingReportRoute.get('/status', (c) => controller.getReceivingReportStatus(c));
receivingReportRoute.get('/csv-export', (c) => controller.csvExport(c));
receivingReportRoute.get('/excel-export', (c) => controller.excelExport(c));

export default receivingReportRoute;