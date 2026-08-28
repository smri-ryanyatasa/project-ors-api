import { Context } from "hono";
import ExcelJS from 'exceljs';

import { ReceivingReportService } from "./receivingReport.service";

export class ReceivingReportController {
    private service = new ReceivingReportService();

    async getReceivingReport(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const initialReceiptStartDate = c.req.query('initialReceiptStartDate') as string;
            const initialReceiptEndDate = c.req.query('initialReceiptEndDate') as string;
            const finalReceiptStartDate = c.req.query('finalReceiptStartDate') as string;
            const finalReceiptEndDate = c.req.query('finalReceiptEndDate') as string;

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

            const response = await this.service.getReceivingReport({
                user_name, 
                env, 
                branch,
                initialReceiptStartDate,
                initialReceiptEndDate,
                finalReceiptStartDate,
                finalReceiptEndDate,
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

    async getReceivingReportStatus(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const branch = Number(c.req.query('branch'));
            const initialReceiptStartDate = c.req.query('initialReceiptStartDate') as string;
            const initialReceiptEndDate = c.req.query('initialReceiptEndDate') as string;
            const finalReceiptStartDate = c.req.query('finalReceiptStartDate') as string;
            const finalReceiptEndDate = c.req.query('finalReceiptEndDate') as string;

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

            const response = await this.service.getReceivingReportStatus({
                user_name, 
                env, 
                branch,
                initialReceiptStartDate,
                initialReceiptEndDate,
                finalReceiptStartDate,
                finalReceiptEndDate,
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
            const initialReceiptStartDate = c.req.query('initialReceiptStartDate') as string;
            const initialReceiptEndDate = c.req.query('initialReceiptEndDate') as string;
            const finalReceiptStartDate = c.req.query('finalReceiptStartDate') as string;
            const finalReceiptEndDate = c.req.query('finalReceiptEndDate') as string;
            
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
                initialReceiptStartDate,
                initialReceiptEndDate,
                finalReceiptStartDate,
                finalReceiptEndDate,
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            const headers = [
                'PL Filename',
                'Sales Invoice',
                'Branch Code',
                'Branch Name',
                'Material Code',
                'Material Description',
                'MMS SKU Code',
                'MMS SKU Name',
                'Vendor Code',
                'Vendor Name',
                'Size/Dim',
                'UOM',
                'PL Qty',
                'Initial Received Qty',
                'Final Received Qty',
                'Initial Received by',
                'Date/Time Initially Received',
                'Initial Receipt Confirmed by',
                'Date/Time Initially Receipt Confirmed',
                'Final Received Qty Updated by',
                'Date/Time of Updated Final Received Qty',
                'Final Received Approved by',
                'Date/Time of Final Receipt Approved'
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.filename,
                        data.sales_invoice_no,
                        data.branch_code,
                        data.branch_name,
                        data.material_code,
                        data.material_name,
                        data.mms_sku_code,
                        data.mms_sku_name,
                        data.vendor_code,
                        data.vendor_name,
                        data.size,
                        data.uom,
                        data.pl_qty,
                        data.initial_qty,
                        data.final_qty,
                        data.initial_received_by,
                        data.initial_received_date,
                        data.confirmed_receipt_by,
                        data.confirmed_receipt_date,
                        data.final_received_by,
                        data.final_received_date,
                        data.approved_receipt_by,
                        data.approved_receipt_date
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
        // const user = c.get('user');
        const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

        const user_name = user.user_name;
        const env = c.req.query('env') as string;
        const branch = Number(c.req.query('branch'));
        const initialReceiptStartDate = c.req.query('initialReceiptStartDate') as string;
        const initialReceiptEndDate = c.req.query('initialReceiptEndDate') as string;
        const finalReceiptStartDate = c.req.query('finalReceiptStartDate') as string;
        const finalReceiptEndDate = c.req.query('finalReceiptEndDate') as string;
        
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
            initialReceiptStartDate,
            initialReceiptEndDate,
            finalReceiptStartDate,
            finalReceiptEndDate,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('PLUploadList');

        worksheet.columns = [
            { header: 'PL Filename', key: 'filename', },
            { header: 'Sales Invoice', key: 'sales_invoice_no', },
            { header: 'Branch Code', key: 'branch_code', },
            { header: 'Branch Name', key: 'branch_name', },
            { header: 'Material Code', key: 'material_code', },
            { header: 'Material Description', key: 'material_name', },
            { header: 'MMS SKU Code', key: 'mms_sku_code', },
            { header: 'MMS SKU Name', key: 'mms_sku_name', },
            { header: 'Vendor Code', key: 'vendor_code', },
            { header: 'Vendor Name', key: 'vendor_name',},
            { header: 'Size/Dim', key: 'size',},
            { header: 'UOM', key: 'uom',},
            { header: 'PL Qty', key: 'pl_qty',},
            { header: 'Initial Received Qty', key: 'initial_qty',},
            { header: 'Final Received Qty', key: 'final_qty',},
            { header: 'Initial Received by', key: 'initial_received_by',},
            { header: 'Date/Time Initially Received', key: 'initial_received_date',},
            { header: 'Initial Receipt Confirmed by', key: 'confirmed_receipt_by',},
            { header: 'Date/Time Initially Receipt Confirmed', key: 'confirmed_receipt_date',},
            { header: 'Final Received Qty Updated by', key: 'final_received_by',},
            { header: 'Date/Time of Updated Final Received Qty', key: 'final_received_date',},
            { header: 'Final Received Approved by', key: 'approved_receipt_by',},
            { header: 'Date/Time of Final Receipt Approved', key: 'approved_receipt_date',},

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