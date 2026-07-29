import { Context } from "hono";
import ExcelJS from 'exceljs';

import { PlUploadService } from "./plUpload.service";

export class PlUploadController {
    private service = new PlUploadService();

    async getPlsUpload(c: Context): Promise<Response> {
       try {
            const user = c.get('user');

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));

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

            const response = await this.service.getPlsUpload({
                user_name, 
                env, 
                branch, 
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

    async getPlsUploadStatus(c: Context): Promise<Response> {
       try {
            const user = c.get('user');

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));

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

            const response = await this.service.getPlsUploadStatus({
                user_name, 
                env, 
                branch,
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
            const user = c.get('user');

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            
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
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            const headers = [
                'Filename',
                'Date & Time',
                'User',
                'Status',
                'Result',
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.filename,
                        data.uploaded_date,
                        data.uploaded_by,
                        data.status,
                        data.result,
                    ]
                    .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
                    .join(',')
                ),
            ];

            const csv = csvRows.join('\n');

            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="users.csv"',
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
        const user = c.get('user');

        const user_name = user.user_name;
        const env = c.req.query('env') as string;
        const branch = Number(c.req.query('branch'));
        
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
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('PLUploadList');

        worksheet.columns = [
            { header: 'Filename', key: 'filename', },
            { header: 'Date and Time', key: 'uploaded_date', },
            { header: 'User', key: 'uploaded_by', },
            { header: 'Status', key: 'status', },
            { header: 'Result', key: 'result',},
        ];

        worksheet.addRows(response);

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Content-Disposition':
                    'attachment; filename="pl_upload.xlsx"',
            },
        });
    }

    async getllUploadLogs(c: Context): Promise<Response> {
        try {
            const user = c.get('user');

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
             const filename = c.req.query('filename') as string;

            const response = await this.service.getPlUploadLogs({
                user_name, 
                env,
                filename,
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

    async getPlUploadExceptions(c: Context): Promise<Response> {
        try {
            const user = c.get('user');

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const filename = c.req.query('filename') as string;

            const response = await this.service.getPlUploadExceptions({
                user_name, 
                env,
                filename,
            });

            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet('PLExceptions');

            worksheet.columns = [
                { header: 'DD No', key: 'document_no', },
                { header: 'SI', key: 'sales_invoice_no', },
                { header: 'Ship to', key: 'ship_to_code', },
                { header: 'Consignee', key: 'consignee', },
                { header: 'UOM', key: 'uom',},
                { header: 'Material', key: 'material',},
                { header: 'Size #', key: 'size',},
                { header: 'Description', key: 'description',},
                { header: 'Served', key: 'served_qty',},
                { header: 'Carton', key: 'carton_qty',},
                { header: 'Branch', key: 'branch_code',},
                { header: 'Vendor', key: 'vendor_code',},
            ];

            worksheet.addRows(response);

            const buffer = await workbook.xlsx.writeBuffer();

            return new Response(buffer, {
                headers: {
                    'Content-Type':
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                    'Content-Disposition':
                        'attachment; filename="pl_exceptions.xlsx"',
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

    async deletePl(c: Context): Promise<Response> {
        try {
            const id = Number(c.req.param('id'));

            const user = await this.service.deletePl(id);

            return c.json(user);
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

}