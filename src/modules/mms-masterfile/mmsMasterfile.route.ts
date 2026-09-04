import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { MmsMasterfileController } from './mmsMasterfile.controller';

const mmsMasterfileRoute = new Hono();

const controller = new MmsMasterfileController();

mmsMasterfileRoute.use('*', authMiddleware);

mmsMasterfileRoute.get('/', (c) => controller.getMmsMasterfile(c));
mmsMasterfileRoute.post('/branch', (c) => controller.createBranch(c));
mmsMasterfileRoute.post('/item', (c) => controller.createItem(c));

export default mmsMasterfileRoute;