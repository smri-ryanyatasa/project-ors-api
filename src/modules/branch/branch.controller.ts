import { Context } from "hono";
import ExcelJS from 'exceljs';


import { BranchService } from "./branch.service";

export class BranchController {
    private service = new BranchService();

    async getBranches(c: Context): Promise<Response> {
        try {
            const user = c.get('user');

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
            
            const response = await this.service.getBranches({
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
        } catch (error) {
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
                'Branch Code',
                'Branch Name',
                'Warehouse Code',
                'Warehouse Name',
                'Store Type',
                'Status',
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.branch_code,
                        data.branch_name,
                        data.warehouse_code,
                        data.warehouse_name,
                        data.store_type,
                        data.status,
                    ]
                    .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
                    .join(',')
                ),
            ];

            const csv = csvRows.join('\n');

            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="branch_masterfile.csv"',
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
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('Branches');

        worksheet.columns = [
            { header: 'Branch Code', key: 'branch_code', },
            { header: 'Branch Name', key: 'branch_name', },
            { header: 'Warehouse Code', key: 'warehouse_code', },
            { header: 'Warehouse Name', key: 'warehouse_name', },
            { header: 'Store Type', key: 'store_type',},
            { header: 'Status', key: 'status',},
        ];

        worksheet.addRows(response);

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Content-Disposition':
                    'attachment; filename="branch_masterfile.xlsx"',
            },
        });
    }
    
   
}