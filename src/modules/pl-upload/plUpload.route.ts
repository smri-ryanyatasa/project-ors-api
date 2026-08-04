import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { PlUploadController } from './plUpload.controller';

const plUploadRoute = new Hono();

const controller = new PlUploadController();

plUploadRoute.use('*', authMiddleware);

plUploadRoute.get('/', (c) => controller.getPlsUpload(c));
plUploadRoute.get('/status', (c) => controller.getPlsUploadStatus(c));
plUploadRoute.get('/csv-export', (c) => controller.csvExport(c));
plUploadRoute.get('/excel-export', (c) => controller.excelExport(c));
plUploadRoute.get('/pl-logs', (c) => controller.getllUploadLogs(c));
plUploadRoute.get('/pl-exceptions', (c) => controller.getPlUploadExceptions(c));
plUploadRoute.post('/create', (c) => controller.plCreate(c));

plUploadRoute.delete('/:id', (c) => controller.deletePl(c));

export default plUploadRoute;