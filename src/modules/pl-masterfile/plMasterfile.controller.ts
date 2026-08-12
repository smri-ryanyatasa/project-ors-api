import { Context } from "hono";
import ExcelJS from 'exceljs';

import { PlMasterfileService } from "./plMasterfile.service";

export class PlMasterfileController {
    private service = new PlMasterfileService();

    async getPlMasterfile(c: Context): Promise<Response> {
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

            const response = await this.service.getPlMasterfile({
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
            return c.json(
                {
                    status: 'error',
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }

    async getPlMasterfileStatus(c: Context): Promise<Response> {
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

            const response = await this.service.getPlMasterfileStatus({
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
                'Status',
                'SI',
                'Branch',
                'Material',
                'Vendor',
                'Uploaded by',
                'Date and Time Uploaded'
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.filename,
                        data.status,
                        data.si_number,
                        data.branch_code,
                        data.material,
                        data.vendor_code,
                        data.uploaded_by,
                        data.uploaded_date
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
            { header: 'Status', key: 'status', },
            { header: 'SI', key: 'si_number', },
            { header: 'Branch', key: 'branch_code', },
            { header: 'Material', key: 'material', },
            { header: 'Vendor', key: 'vendor_code', },
            { header: 'Uploaded by', key: 'uploaded_by',},
            { header: 'Date and Time Uploaded', key: 'uploaded_date',},
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