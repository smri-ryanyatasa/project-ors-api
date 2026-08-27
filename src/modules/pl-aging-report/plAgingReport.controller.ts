import { Context } from "hono";
import ExcelJS from 'exceljs';

import { PlAgingReportService } from "./plAgingReport.service";

export class PlAgingReportController {
    private service = new PlAgingReportService();

    async getPlAgingReport(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const uploadedStartDate = c.req.query('uploadedStartDate') as string;
            const uploadedEndDate = c.req.query('uploadedEndDate') as string;
            const initialStartDate = c.req.query('initialStartDate') as string;
            const initialEndDate = c.req.query('initialEndDate') as string;
            const approveReceiptStartDate = c.req.query('approveReceiptStartDate') as string;
            const approveReceiptEndDate = c.req.query('approveReceiptEndDate') as string;
            const poGeneratedStartDate = c.req.query('poGeneratedStartDate') as string;
            const poGeneratedEndDate = c.req.query('poGeneratedEndDate') as string;

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

            const response = await this.service.getPlAgingReport({
                user_name, 
                env, 
                uploadedStartDate,
                uploadedEndDate,
                initialStartDate,
                initialEndDate,
                approveReceiptStartDate,
                approveReceiptEndDate, 
                poGeneratedStartDate,
                poGeneratedEndDate,
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

    async getPlAgingReportStatus(c: Context): Promise<Response> {
       try {
            const user = c.get('user') ?? { user_name: c.req.query('user_name') as string };

            const user_name = user.user_name;
            const env = c.req.query('env') as string;
            const uploadedStartDate = c.req.query('uploadedStartDate') as string;
            const uploadedEndDate = c.req.query('uploadedEndDate') as string;
            const initialStartDate = c.req.query('initialStartDate') as string;
            const initialEndDate = c.req.query('initialEndDate') as string;
            const approveReceiptStartDate = c.req.query('approveReceiptStartDate') as string;
            const approveReceiptEndDate = c.req.query('approveReceiptEndDate') as string;
            const poGeneratedStartDate = c.req.query('poGeneratedStartDate') as string;
            const poGeneratedEndDate = c.req.query('poGeneratedEndDate') as string;

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

            const response = await this.service.getPlAgingReportStatus({
                user_name, 
                env, 
                uploadedStartDate,
                uploadedEndDate,
                initialStartDate,
                initialEndDate,
                approveReceiptStartDate,
                approveReceiptEndDate, 
                poGeneratedStartDate,
                poGeneratedEndDate,
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
            const uploadedStartDate = c.req.query('uploadedStartDate') as string;
            const uploadedEndDate = c.req.query('uploadedEndDate') as string;
            const initialStartDate = c.req.query('initialStartDate') as string;
            const initialEndDate = c.req.query('initialEndDate') as string;
            const approveReceiptStartDate = c.req.query('approveReceiptStartDate') as string;
            const approveReceiptEndDate = c.req.query('approveReceiptEndDate') as string;
            const poGeneratedStartDate = c.req.query('poGeneratedStartDate') as string;
            const poGeneratedEndDate = c.req.query('poGeneratedEndDate') as string;
            
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
                uploadedStartDate,
                uploadedEndDate,
                initialStartDate,
                initialEndDate,
                approveReceiptStartDate,
                approveReceiptEndDate, 
                poGeneratedStartDate,
                poGeneratedEndDate,
                search, 
                sortColum, 
                sortOrder,
                filterModel
            });

            const headers = [
                'PL Filename',
                'Line Items',
                'Current Status',
                'Upload Date',
                'Available Date',
                'Aging (Days) from Upload to Available',
                'Initial Receipt Date',
                'Aging (Days) from Available to Initial Receipt',
                'Approved Receipt Date',
                'Aging (Days) from Initial Receipt to Approved Receipt',
                'MMS PO Generated Date',
                'Aging (Days) from Approved Receipt to MMS PO Generated'
            ];

            const csvRows = [
                headers.join(','),
                ...response.map((data) =>
                    [
                        data.filename,
                        data.line_items,
                        data.current_status,
                        data.uploaded_date,
                        data.available_date,
                        data.aging_upload_available,
                        data.initial_receipt_date,
                        data.aging_available_initial,
                        data.approved_receipt_date,
                        data.aging_initial_approve,
                        data.po_generated_date,
                        data.aging_approve_po_gen
                    ]
                    .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
                    .join(',')
                ),
            ];

            const csv = csvRows.join('\n');

            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': 'attachment; filename="Pl Aging Report.csv"',
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
        const uploadedStartDate = c.req.query('uploadedStartDate') as string;
        const uploadedEndDate = c.req.query('uploadedEndDate') as string;
        const initialStartDate = c.req.query('initialStartDate') as string;
        const initialEndDate = c.req.query('initialEndDate') as string;
        const approveReceiptStartDate = c.req.query('approveReceiptStartDate') as string;
        const approveReceiptEndDate = c.req.query('approveReceiptEndDate') as string;
        const poGeneratedStartDate = c.req.query('poGeneratedStartDate') as string;
        const poGeneratedEndDate = c.req.query('poGeneratedEndDate') as string;
        
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
            uploadedStartDate,
            uploadedEndDate,
            initialStartDate,
            initialEndDate,
            approveReceiptStartDate,
            approveReceiptEndDate, 
            poGeneratedStartDate,
            poGeneratedEndDate,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet('PLUploadList');

        worksheet.columns = [
            { header: 'PL Filename', key: 'filename', },
            { header: 'Line Items', key: 'line_items', },
            { header: 'Current Status', key: 'current_status', },
            { header: 'Upload Date', key: 'uploaded_date', },
            { header: 'Available Date', key: 'available_date', },
            { header: 'Aging (Days) from Upload to Available', key: 'aging_upload_to_available', },
            { header: 'Initial Receipt Date', key: 'initial_receipt_date', },
            { header: 'Aging (Days) from Available to Initial Receipt', key: 'aging_available_to_initial', },
            { header: 'Approved Receipt Date', key: 'approved_receipt_date', },
            { header: 'Aging (Days) from Initial Receipt to Approved Receipt', key: 'aging_initial_approve',},
            { header: 'MMS PO Generated Date', key: 'po_generated_date',},
            { header: 'Aging (Days) from Approved Receipt to MMS PO Generated', key: 'aging_approve_po_gen',},

        ];

        worksheet.addRows(response);

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

                'Content-Disposition':
                    'attachment; filename="Pl Aging Report.xlsx"',
            },
        });
    }
}