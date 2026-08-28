import { Context } from "hono";
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

import { PlUploadRowSchema, SourceFileSchema, PlUploadRowIntegerSchema } from "./plUpload.schema";
import { PlUploadService } from "./plUpload.service";

export class PlUploadController {
    private service = new PlUploadService();

    private readonly SUCCESS = 'Successfully uploaded with no errors.';
    private readonly ERROR = (error: number, total: number) => `${error} out of ${total} rows have errors.`;
    private readonly UNASSIGNED_BRANCH = 'You are no longer authorized to make changes on the selected Branch.'

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

            const data = response.map((row) => ({
                'DD No': row.document_no,
                'SI': row.sales_invoice_no,
                'Ship To Code': row.ship_to_code,
                'Consignee': row.consignee,
                'UOM': row.uom,
                'Material': row.material,
                'Size No': row.size,
                'Description': row.description,
                'Served Qty': row.served_qty,
                'Carton Qty': row.carton_qty,
                'Branch': row.branch_code,
                'Vendor': row.vendor_code,
                'Reason': row.reason,
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);

            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                'PLExceptions'
            );

            const buffer = XLSX.write(workbook, {
            type: 'buffer',
            bookType: 'xls',
            });

            return new Response(buffer, {
                headers: {
                    'Content-Disposition': 'attachment; filename="sample.xls"',
                    'Content-Type': 'application/vnd.ms-excel',
                },
            });

            // const workbook = new ExcelJS.Workbook();

            // const worksheet = workbook.addWorksheet('PLExceptions');

            // worksheet.columns = [
            //     { header: 'DD No', key: 'document_no', },
            //     { header: 'SI', key: 'sales_invoice_no', },
            //     { header: 'Ship to', key: 'ship_to_code', },
            //     { header: 'Consignee', key: 'consignee', },
            //     { header: 'UOM', key: 'uom',},
            //     { header: 'Material', key: 'material',},
            //     { header: 'Size #', key: 'size',},
            //     { header: 'Description', key: 'description',},
            //     { header: 'Served', key: 'served_qty',},
            //     { header: 'Carton', key: 'carton_qty',},
            //     { header: 'Branch', key: 'branch_code',},
            //     { header: 'Vendor', key: 'vendor_code',},
            //     { header: 'Reason', key: 'reason',},
            // ];

            // worksheet.addRows(response);

            // const buffer = await workbook.xlsx.writeBuffer();

            // return new Response(buffer, {
            //     headers: {
            //         'Content-Disposition': 'attachment; filename="pl_exceptions.xls"',
            //         'Content-Type': 'application/vnd.ms-excel',
            //     },
            // });


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
                    message: 'This item may have already been deleted. Please refresh the list.',
                },
                500
            );
        }
    }

    async plCreate(c: Context): Promise<Response> {
        try {
            const user = c.get('user');

            const user_name = user.user_name;

            const body = await c.req.json();

            const fieldLabels: Record<string, string> = {
                document_no: 'DD No',
                sales_invoice_no: 'SI',
                ship_to_code: 'Ship To Code',
                consignee: 'Consignee',
                uom: 'UOM',
                material: 'Material',
                size: 'Size',
                description: 'Description',
                served_qty: 'Served Qty',
                carton_qty: 'Carton Cnt',
                branch_code: 'Branch',
                vendor_code: 'Vendor',
            };

            const integerValidation = PlUploadRowIntegerSchema.safeParse(body.rows);

            if (!integerValidation.success) {
                const errors = integerValidation.error.issues.map((issue) => ({
                    row: issue.path[0],
                    field: issue.path[1],
                    message: issue.message,
                }));
                return c.json({
                    message: 'Validation failed',
                    errors,
                }, 400);
            }

            const rows = body.rows.map((row: any) => {
                const validation = PlUploadRowSchema.safeParse(row);

                return {
                ...row,
                reason: validation.success
                    ? ''
                    : validation.error.issues
                        .map((issue) => `${fieldLabels[String(issue.path[0])]}: ${issue.message}`)
                        .join(', '),
                };
            });

            // const hasErrors = rows.some((row: any) => row.reason.length > 0);
            const hasErrors = rows.filter((row: any) => row.reason.length > 0).length;

            const response = {
                ...body,
                rows,
                status: hasErrors > 0 ? 1 : 2,
                result: hasErrors > 0 ? this.ERROR(hasErrors, body.rows.length) : this.SUCCESS,
                tran_type: 1,
                uploaded_attempts: 1,
                tran_date: new Date(),
                user_name
            };
            
            const result = await this.service.plUpload(response);

            return c.json(result);
        } catch(error) {
            if (error instanceof Error && error.message === 'PL File already exists.') {
                return c.json(
                    {
                        status: 'error',
                        message: 'PL File already exists.',
                    },
                    400
                );
            }

            if (error instanceof Error && error.message === this.UNASSIGNED_BRANCH) {
                return c.json(
                    {
                        status: 'error',
                        message: this.UNASSIGNED_BRANCH,
                    },
                    400
                );
            }

            return c.json(
                {
                    status: error,
                    message: 'Something went wrong.',
                },
                500
            );
        }
    } 

    async plReUpload(c: Context): Promise<Response> {
        try {
            const body = await c.req.json();

            const user = c.get('user');

            const user_name = user.user_name;

            const fieldLabels: Record<string, string> = {
                document_no: 'DD No',
                sales_invoice_no: 'SI',
                ship_to_code: 'Ship To Code',
                consignee: 'Consignee',
                uom: 'UOM',
                material: 'Material',
                size: 'Size',
                description: 'Description',
                served_qty: 'Served Qty',
                carton_qty: 'Carton Cnt',
                branch_code: 'Branch',
                vendor_code: 'Vendor',
            };
            
            const integerValidation = PlUploadRowIntegerSchema.safeParse(body.rows);

            if (!integerValidation.success) {
                const errors = integerValidation.error.issues.map((issue) => ({
                    row: issue.path[0],
                    field: issue.path[1],
                    message: issue.message,
                }));
                return c.json({
                    message: 'Validation failed',
                    errors,
                }, 400);
            }

            const rows = body.rows.map((row: any) => {
                const validation = PlUploadRowSchema.safeParse(row);

                return {
                ...row,
                reason: validation.success
                    ? ''
                    : validation.error.issues
                        .map((issue) => `${fieldLabels[String(issue.path[0])]}: ${issue.message}`)
                        .join(', '),
                };
            });

            const hasErrors = rows.filter((row: any) => row.reason.length > 0).length;

            const response = {
                ...body,
                rows,
                status: hasErrors > 0 ? 1 : 2,
                result: hasErrors > 0 ? this.ERROR(hasErrors, body.rows.length) : this.SUCCESS,
                tran_type: 1,
                tran_date: new Date(),
                uploaded_date: new Date(),
                user_name
            };
            
            const result = await this.service.plReUpload(response); 

            return c.json(result);

        } catch(error) {
            if (error instanceof Error && error.message === 'PL File not found.') {
                return c.json(
                    {
                        status: 'error',
                        message: 'PL File not found.',
                    },
                    400
                );
            }

            if (error instanceof Error && error.message === this.UNASSIGNED_BRANCH) {
                return c.json(
                    {
                        status: 'error',
                        message: this.UNASSIGNED_BRANCH,
                    },
                    400
                );
            }

            return c.json(
                {
                    status: error,
                    message: 'Something went wrong.',
                },
                500
            );
        }
    }
            

}