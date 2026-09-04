import { Context } from "hono";
import ExcelJS from 'exceljs';

import { PoLogsService } from "./poLogs.service";

export class PoLogsController {
    private service = new PoLogsService();

    async getPoLogs(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;

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

            const response = await this.service.getPoLogs({
                user_name, 
                env,
                page, 
                pageSize, 
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            return c.json(response);

        }  catch(error) {
            console.log(error);
            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async getPoLogsStatus(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;

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

            const response = await this.service.getPoLogsStatus({
                user_name, 
                env,
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
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            const headers = [
                'PL Filename',
                'Sales Invoice',
                'Branch',
                'Line Items',
                'Date/Time in Approved Receipt Status',
                'Date/Time of Failed PO Generation',
                'Date/Time of Successfuly Generated PO',
                'Aging(Mins) from Approved Recipt to Successfully Generated PO',
                'Status',
                'MMS PO Number'
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.filename,
                        data.sales_invoice_no,
                        data.branch_code,
                        data.row_count,
                        data.approved_receipt_date,
                        data.faile_date,
                        data.po_generated_date,
                        data.aging,
                        data.status,
                        data.mms_po_number
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
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('PLUploadList');

        worksheet.columns = [
            { header: 'PL Filename', key: 'filename', },
            { header: 'Sales Invoice', key: 'si_number', },
            { header: 'Branch', key: 'branch_code', },
            { header: 'Line Items', key: 'row_count', },
            { header: 'Date/Time in Approved Receipt Status', key: 'approved_receipt_date', },
            { header: 'Date/Time of Failed PO Generation', key: 'failed_date', },
            { header: 'Date/Time of Successfuly Generated PO', key: 'po_generated_date', },
            { header: 'Aging(Mins) from Approved Recipt to Successfully Generated PO', key: 'aging', },
            { header: 'Status', key: 'status', },
            { header: 'MMS PO Number', key: 'mms_po_number',},

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
}