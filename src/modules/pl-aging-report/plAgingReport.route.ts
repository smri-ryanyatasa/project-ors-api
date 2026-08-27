import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { PlAgingReportController } from './plAgingReport.controller';

const plAgingReportRoute = new Hono();

const controller = new PlAgingReportController();

plAgingReportRoute.use('*', authMiddleware);

plAgingReportRoute.get('/', (c) => controller.getPlAgingReport(c));
plAgingReportRoute.get('/status', (c) => controller.getPlAgingReportStatus(c));
plAgingReportRoute.get('/csv-export', (c) => controller.csvExport(c));
plAgingReportRoute.get('/excel-export', (c) => controller.excelExport(c));

export default plAgingReportRoute;