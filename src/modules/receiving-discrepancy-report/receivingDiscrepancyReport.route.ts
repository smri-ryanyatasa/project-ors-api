import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { ReceivingDiscrepancyReportController } from './receivingDiscrepancyReport.controller';

const receivingDiscrepancyReportRoute = new Hono();

const controller = new ReceivingDiscrepancyReportController();

receivingDiscrepancyReportRoute.use('*', authMiddleware);

receivingDiscrepancyReportRoute.get('/', (c) => controller.getReceivingDiscrepancyReport(c));
receivingDiscrepancyReportRoute.get('/status', (c) => controller.getReceivingDiscrepancyReportStatus(c));
receivingDiscrepancyReportRoute.get('/csv-export', (c) => controller.csvExport(c));
receivingDiscrepancyReportRoute.get('/excel-export', (c) => controller.excelExport(c));

export default receivingDiscrepancyReportRoute;