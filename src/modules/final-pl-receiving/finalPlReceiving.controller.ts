import { Context } from "hono";
import ExcelJS from 'exceljs';

import { FinalPlReceivingService } from "./finalPlReceiving.service";

export class FinalPlReceivingController {
    private service = new FinalPlReceivingService();
    private errorMessage = 'Something went wrong. Please try again or contact your administrator.';
    private exportErrorMessage = 'Failed to download the file. Please try again.';

    async getFinalPlReceiving(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const filename = c.req.query('filename') as string;
            const vendor_code = c.req.query('vendor_code') as string;
            const si_number = Number(c.req.query('si_number'));

            // Filter
            const page = Number(c.req.query('page') || 1);
            const pageSize = Number(c.req.query('pageSize') || 5);
            const search = c.req.query('search') || null;
            const filterModelParam = c.req.query('filterModel') || null;
            const sortModelParam = c.req.query('sortModel');

            const filterModel = filterModelParam;
            
            const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];
            
            const queries = c.req.queries();
  
            const sortColum = sortModel[0].field;
            const sortOrder = sortModel[0].sort;

            const response = await this.service.getFinalPlReceiving({
                user_name, 
                env, 
                branch,
                filename,
                vendor_code,
                si_number,
                page, 
                pageSize, 
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            return c.json(response);

        }  catch(error) {
            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async getFinalPlReceivingStatus(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const filename = c.req.query('filename') as string;
            const vendor_code = c.req.query('vendor_code') as string;
            const si_number = Number(c.req.query('si_number'));

            // Filter
            const search = c.req.query('search') || null;
            const filterModelParam = c.req.query('filterModel') || null;
            const sortModelParam = c.req.query('sortModel');

            const filterModel = filterModelParam;
            
            const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];
            

            const sortColum = sortModel[0].field;
            const sortOrder = sortModel[0].sort;

            const response = await this.service.getFinalPlReceivingStatus({
                user_name, 
                env, 
                branch,
                filename,
                vendor_code,
                si_number,
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            return c.json(response);

        }  catch(error) {
            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async csvExport(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const filename = c.req.query('filename') as string;
            const vendor_code = c.req.query('vendor_code') as string;
            const si_number = Number(c.req.query('si_number'));
            
            // Filter
            const search = c.req.query('search') || null;
            const filterModelParam = c.req.query('filterModel') || null;
            const sortModelParam = c.req.query('sortModel');

            const filterModel = filterModelParam;
            
            const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];
            
            const sortColum = sortModel[0].field;
            const sortOrder = sortModel[0].sort;

            const response = await this.service.csvExport({
                user_name, 
                env, 
                branch,
                filename,
                vendor_code,
                si_number,
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            const headers = [
                'Material Code',
                'Material Description',
                'MMS SKU Code',
                'MMS SKU Name',
                'Size/Dim',
                'UOM',
                'Pl Qty',
                'Initial Received Qty',
                'PL-Initial Discrepancy',
                'Final Received Qty',
                'Initial-Final Discrepancy',
                'Inital Received by',
                'Date/Time Initially Received',
                'Final Received Qty Updated by',
                'Date/Time of Updated Final Received Qty'
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.material_code,
                        data.material_name,
                        data.mms_sku_code,
                        data.mms_sku_name,
                        data.size,
                        data.uom,
                        data.pl_qty,
                        data.initial_qty,
                        data.pl_initial_discrepancy,
                        data.final_qty,
                        data.initial_final_discrepancy,
                        data.initial_received_by,
                        data.initial_received_date,
                        data.final_received_by,
                        data.final_received_date
                    ]
                    .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
                    .join(',')
                ),
            ];

            const csv = csvRows.join('\n');

            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="Receiving Report.csv"',
                },
            });

        }  catch(error) {
            return c.json(
                {
                    status: 'error',
                    message: error instanceof Error
                        ? error.message
                        : this.exportErrorMessage,  
                },
                500
            );
        }
    }

    async excelExport(c: Context): Promise<Response> {
        try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const filename = c.req.query('filename') as string;
            const vendor_code = c.req.query('vendor_code') as string;
            const si_number = Number(c.req.query('si_number'));
            
            // Filter
            const search = c.req.query('search') || null;
            const filterModelParam = c.req.query('filterModel') || null;
            const sortModelParam = c.req.query('sortModel');

            const filterModel = filterModelParam;
            
            const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];
            
            const sortColum = sortModel[0].field;
            const sortOrder = sortModel[0].sort;

            const response = await this.service.excelExport({
                user_name, 
                env, 
                branch,
                filename,
                vendor_code,
                si_number,
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('PLUploadList');

            worksheet.columns = [
                { header: 'Material Code', key: 'material_code', },
                { header: 'Material Description', key: 'material_name', },
                { header: 'MMS SKU Code', key: 'mms_sku_code', },
                { header: 'MMS SKU Name', key: 'mms_sku_name', },
                { header: 'Size/Dim', key: 'size',},
                { header: 'UOM', key: 'uom',},
                { header: 'Pl Qty', key: 'pl_qty',},
                { header: 'Initial Received Qty', key: 'initial_qty',},
                { header: 'PL-Initial Discrepancy', key: 'pl_initial_discrepancy',},
                { header: 'Final Received Qty', key: 'final_qty',},
                { header: 'Initial-Final Discrepancy', key: 'initial_final_discrepancy',},
                { header: 'Inital Received by', key: 'initial_received_by',},
                { header: 'Date/Time Initially Received', key: 'initial_received_date',},
                { header: 'Final Received Qty Updated by', key: 'final_received_by',},
                { header: 'Date/Time of Updated Final Received Qty', key: 'final_received_date',},
            ];

            worksheet.addRows(response);

            const buffer = await workbook.xlsx.writeBuffer();

            return new Response(buffer, {
                headers: {
                    'Content-Type':
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                    'Content-Disposition':
                        'attachment; filename="Receiving Report.xlsx"',
                },
            });
        } catch (error) {
            return c.json(
                {
                    status: 'error',
                    message: error instanceof Error
                        ? error.message
                        : this.exportErrorMessage,  
                },
                500
            );
        }
        
    }

    async rowsUpdate(c: Context): Promise<Response> {
        try {
            const user = c.get('user')
            const rows = await c.req.json();
            
            const received_by = user.user_id

            if (!Array.isArray(rows) || rows.length === 0) {
                return c.json({
                    status: 'success',
                    message: 'Nothing to update.'
                });
            }

            await this.service.rowsUpdate({rows, received_by});

            return c.json({
                status: 'success',
                message: 'Updated successfully.'
            });
        } catch(error) {
            return c.json(
                {
                    status: 'error',
                    message: error instanceof Error
                        ? error.message
                        : this.errorMessage,  
                },
                500
            );
        }
    }

    async toApproved(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const last_update_by = user.user_id;

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const filename = c.req.query('filename') as string;
            const vendor_code = c.req.query('vendor_code') as string;
            const si_number = Number(c.req.query('si_number'));
            const status = '4'; // Approved Receipt

            // Filter
            const search = c.req.query('search') || null;
            const filterModelParam = c.req.query('filterModel') || null;
            const sortModelParam = c.req.query('sortModel');

            const filterModel = filterModelParam;
            
            const sortModel = sortModelParam
            ? JSON.parse(sortModelParam)
            : [];
            
            const queries = c.req.queries();
  
            const sortColum = sortModel[0].field;
            const sortOrder = sortModel[0].sort;

            const response = await this.service.toApproved({
                user_name, 
                env, 
                branch,
                filename,
                vendor_code,
                si_number,
                search, 
                sortColum, 
                sortOrder,
                filterModel,
                status,
                last_update_by
            });

            return c.json(response);

        }  catch(error) {
            return c.json(
                {
                    status: 'error',
                    message: this.errorMessage,
                },
                500
            );
        }
    }
 }