import { Context } from "hono";
import ExcelJS from 'exceljs';

import { InitialPlReceivingService } from "./initialPlReceiving.service";

export class InitialPlReceivingController {
    private service = new InitialPlReceivingService();


    async getInitialPlReceiving(c: Context): Promise<Response> {
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

            const response = await this.service.getInitialPlReceiving({
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

    async getInitialPlReceivingStatus(c: Context): Promise<Response> {
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

            const response = await this.service.getInitialPlReceivingStatus({
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
            console.log(error)
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
                'Actual Received',
                'Status',
                'Received by',
                'Date/Time Received'
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
                        data.actual_received,
                        data.status,
                        data.received_by,
                        data.received_date
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
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async excelExport(c: Context): Promise<Response> {
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
            { header: 'Actual Received', key: 'actual_received',},
            { header: 'Status', key: 'status',},
            { header: 'Received by', key: 'received_by',},
            { header: 'Date/Time Received', key: 'received_date',},
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
    }

    async plFiles(c: Context): Promise<Response> {
        const branchId = Number(c.req.param('branch_id'));

        const filenames = await this.service.plFiles(branchId);

        return c.json(filenames);
    }

    async getPlsFiles(c: Context): Promise<Response> {
        const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

        const user_name = user.user_name;
        const env = c.req.query('env') as string;
        const branchId = Number(c.req.query('branch_id'));

        const data = await this.service.getPlsFiles({branchId, env, user_name});

        return c.json(data)
    }
}