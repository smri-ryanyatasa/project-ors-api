import { Context } from "hono";
import ExcelJS from 'exceljs';


import { ItemService } from "./item.service";

export class ItemController {
    private service = new ItemService();

    async fetch(c: Context): Promise<Response> {
        const env = c.req.query('env') || 'SCP';
        const page = Number(c.req.query('page') || 1);
        const pageSize = Number(c.req.query('pageSize') || 5);
        const search = c.req.query('search') || '';
        const filterModelParam = c.req.query('filterModel');
        const sortModelParam = c.req.query('sortModel');

        const filterModel = filterModelParam
        ? JSON.parse(filterModelParam)
        : [];
        
        const sortModel = sortModelParam
        ? JSON.parse(sortModelParam)
        : [];

        const result = await this.service.fetch({env, page, pageSize, search, filterModel, sortModel});
        return c.json(result);
    }

    async getItems(c: Context): Promise<Response> {
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
            
            const response = await this.service.getItems({
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
                'Style Code',
                'Style Name',
                'SKU Code',
                'SKU Name',
                'UPC',
                'Primary Vendor Code',
                'Primary Vendor Name',
                'Alt Vendor Code',
                'Alt Vendor Name',
                'Dept Code',
                'Dept Name',
                'Subdept Code',
                'Subdept Name',
                'Class Code',
                'Class Name',
                'Subclass Code',
                'Subclass Name',
                'Buying UOM',
                'Color',
                'Size Dimension',
                'Current Regular Retail',
                'Status',
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.style_code,
                        data.style_name,
                        data.sku_code,
                        data.sku_name,
                        data.upc,
                        data.primary_vendor_code,
                        data.primary_vendor_name,
                        data.alt_vendor_code,
                        data.alt_vendor_name,
                        data.dept_code,
                        data.dept_name,
                        data.subdept_code,
                        data.subdept_name,
                        data.class_code,
                        data.class_name,
                        data.subclass_code,
                        data.subclass_name,
                        data.buying_uom,
                        data.color,
                        data.size_dimension,
                        data.curr_regular_retail,
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
                    'Content-Disposition': 'attachment; filename="item_masterfile.csv"',
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
            { header: 'Style Code', key: 'style_code', },
            { header: 'Style Name', key: 'style_name', },
            { header: 'SKU Code', key: 'sku_code', },
            { header: 'SKU Name', key: 'sku_name', },
            { header: 'UPC', key: 'upc',},
            { header: 'Primary Vendor Code', key: 'primary_vendor_code',},
            { header: 'Primary Vendor Name', key: 'primary_vendor_name', },
            { header: 'Alt Vendor Code', key: 'alt_vendor_code', },
            { header: 'Alt Vendor Name', key: 'alt_vendor_name', },
            { header: 'Dept Code', key: 'dept_code', },
            { header: 'Dept Name', key: 'dept_name',},
            { header: 'Subdept Code', key: 'subdept_code',},
            { header: 'Subdept Name', key: 'subdept_name', },
            { header: 'Class Code', key: 'class_code', },
            { header: 'Class Name', key: 'class_name', },
            { header: 'Subclass Code', key: 'subclass_code', },
            { header: 'Subclass Name', key: 'subclass_name',},
            { header: 'Buting UOM', key: 'buying_uom',},
            { header: 'Color', key: 'color', },
            { header: 'Size Dimension', key: 'size_dimension', },
            { header: 'Current Regular Retail', key: 'curr_regular_retail', },
            { header: 'Status', key: 'status', },
        ];

        worksheet.addRows(response);

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Content-Disposition':
                    'attachment; filename="item_masterfile.xlsx"',
            },
        });
    }
    
    async itemRowsUpdate(c: Context): Promise<Response> {
        try {
            const body = await c.req.json();
            
            const result = await this.service.itemRowsUpdate(body);
    
            return c.json({
                status: 'success',
                message: 'Updated successfully'
            });
            
        } catch(error) {
            console.error(error);

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