import { Hono } from 'hono';

import { authMiddleware } from '../../common/middleware/auth.middleware';
import { ReceivingApprovalController } from './receiving_approval.controller';

const receivingApprovalRoute = new Hono();

const controller = new ReceivingApprovalController();

receivingApprovalRoute.use('*', authMiddleware);

receivingApprovalRoute.get('/', (c) => controller.getStores(c));
receivingApprovalRoute.put('/', (c) => controller.update(c));


export default receivingApprovalRoute;