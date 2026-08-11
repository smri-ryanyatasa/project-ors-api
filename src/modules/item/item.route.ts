import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { ItemController } from './item.controller';

const itemRoute = new Hono();

const controller = new ItemController();

itemRoute.use('*', authMiddleware);

itemRoute.get('/', (c) => controller.getItems(c));
itemRoute.get('/item-fetch', (c) => controller.fetch(c));
itemRoute.get('/csv-export', (c) => controller.csvExport(c));
itemRoute.get('/excel-export', (c) => controller.excelExport(c));
itemRoute.put('/update-rows', (c) => controller.itemRowsUpdate(c));

export default itemRoute;