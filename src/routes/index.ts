import { Hono } from 'hono';

import userRoute from '../modules/user/user.route';
import authRoute from '../modules/auth/auth.route';
import rolePermissionsRoute from '../modules/rolePermissions/rolePermissions.route';
import plUploadRoute from '../modules/pl-upload/plUpload.route';
import plMasterfileRoute from '../modules/pl-masterfile/plMasterfile.route';
import branchRoute from '../modules/branch/branch.route';
import itemRoute from '../modules/item/item.route';
import initialPlReceivingRoute from '../modules/initial-pl-receiving/initialPlReceiving.route';
import finalPlReceivingRoute from '../modules/final-pl-receiving/finalPlReceiving.route';
import plAgingReportRoute from '../modules/pl-aging-report/plAgingReport.route';
import receivingReportRoute from '../modules/receiving-report/receivingReport.route';
import receivingDiscrepancyReportRoute from '../modules/receiving-discrepancy-report/receivingDiscrepancyReport.route';

const routes = new Hono();

routes.route('/users', userRoute);
routes.route('/auth', authRoute);
routes.route('/role-permissions', rolePermissionsRoute);
routes.route('/pl-upload', plUploadRoute);
routes.route('/pl-masterfile', plMasterfileRoute);
routes.route('/branch', branchRoute);
routes.route('/item', itemRoute);
routes.route('/initial-pl-receiving', initialPlReceivingRoute);
routes.route('/final-pl-receiving', finalPlReceivingRoute);
routes.route('/pl-ageing-report', plAgingReportRoute);
routes.route('/receiving-report', receivingReportRoute);
routes.route('/receiving-decrepancy-report', receivingDiscrepancyReportRoute);

export default routes;