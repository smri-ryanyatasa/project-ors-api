import sql from 'mssql';

import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { PlsUpload, PlsUploadStatus, PlsUploadLogs, PLsList, PlsCreate } from './plUpload.types';

export class PlUploadRepository {
    async plsUpload({
        user_name, 
        env, 
        branch,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlsUpload) {

        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('page_number', sql.Int, page)
                .input('page_size', sql.Int, pageSize)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch_code', sql.Int, branch ?? null)
                .query(`
                    SELECT * 
                        FROM dbo.GetPlUploadListDynamic
                        (
                            @env,
                            @user_name, 
                            @page_number, 
                            @page_size, 
                            @search, 
                            @sort_column, 
                            @sort_order, 
                            @filters_json,
                            @branch_code
                        );
                `);
        });

        return result.recordset;
    }

    async plsUploadStatus({
        user_name, 
        env, 
        branch,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlsUploadStatus) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch_code', sql.Int, branch ?? null)
                .query(`
                    SELECT * 
                        FROM dbo.[GetPlUploadlStatusFnc]
                        (
                            @env,
                            @user_name, 
                            @search, 
                            @sort_column, 
                            @sort_order, 
                            @filters_json,
                            @branch_code
                        );
                `);
        });
        
        return result.recordset;
    }

    async csvExport({
        user_name, 
        env, 
        branch,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlsUploadStatus) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('page_number', sql.Int, null)
                .input('page_size', sql.Int, null)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch_code', sql.Int, branch ?? null)
                .query(`
                    SELECT * 
                        FROM dbo.GetPlUploadListDynamic
                        (
                            @env,
                            @user_name, 
                            @page_number, 
                            @page_size, 
                            @search, 
                            @sort_column, 
                            @sort_order, 
                            @filters_json,
                            @branch_code
                        );
                `);
        });
        
        return result.recordset;
    }

    async excelExport({
        user_name, 
        env, 
        branch,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlsUploadStatus) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('page_number', sql.Int, null)
                .input('page_size', sql.Int, null)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch_code', sql.Int, branch ?? null)
                .query(`
                    SELECT * 
                        FROM dbo.GetPlUploadListDynamic
                        (
                            @env,
                            @user_name, 
                            @page_number, 
                            @page_size, 
                            @search, 
                            @sort_column, 
                            @sort_order, 
                            @filters_json,
                            @branch_code
                        );
                `);
        });

        return result.recordset;
    }

    async plUploadLogs({
        user_name, 
        env, 
        filename
    }: PlsUploadLogs) {

        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('filename', sql.VarChar, filename)
                .query(`
                    SELECT * 
                        FROM dbo.GetPlUploadLogs
                        (
                            @env,
                            @user_name, 
                            @filename
                        );
                `);
        });

        return result.recordset;
    }

    async plUploadExceptions({
        user_name, 
        env, 
        filename
    }: PlsUploadLogs) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, 'SCP')
                .input('user_name', sql.VarChar, user_name)
                .input('filename', sql.VarChar, filename)
                .query(`
                    SELECT * 
                        FROM dbo.GetPlException
                        (
                            @env,
                            @user_name, 
                            @filename
                        );
                `);
        });

        return result.recordset;
    }

    async findPlById(id: Number): Promise<PLsList> {
        const db = await getDb();
        
        const result = await db
            .request()
            .input('id', sql.Int, id)
            .query(`
                SELECT *
                FROM ors_source_file
                WHERE source_file_id = @id
            `);

        return result.recordset[0] ?? null;
    }

    async deletePl(id: number): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM ors_source_file
                WHERE source_file_id = @id
            `);

        await this.deletePackingListBySourceFileId(id);
    }

    async plUpload(payload: PlsCreate): Promise<Response> {
        const db = await getDb();
        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            // const request = new sql.Request(transaction);

            const result = await withUserContext(payload.user_name, async (request) => {
                return await request
                    .input('filename', sql.VarChar, payload.filename)
                    .input('vendor_code', sql.Int, payload.vendor_code)
                    .input('si_number', sql.VarChar, payload.sales_invoice_no)
                    .input('branch_code', sql.Int, payload.branch_code)
                    .input('file_size', sql.Int, payload.file_size) 
                    .input('tran_type', sql.Int, payload.tran_type)
                    .input('env', sql.VarChar, payload.env)
                    .input('uploaded_by', sql.Int, payload.uploaded_by)
                    .input('row_count', sql.Int, payload.row_count)
                    .input('created_by', sql.Int, payload.created_by)
                    .input('uploaded_attempts', sql.Int, payload.uploaded_attempts)
                    .input('status', sql.Int, payload.status)
                    .input('tran_date', sql.DateTime, payload.tran_date)
                    .input('result', sql.VarChar, payload.result)

                    .query(`
                        DECLARE @Inserted TABLE (
                            source_file_id BIGINT
                        );

                        INSERT INTO ors_source_file
                        (
                            filename,
                            vendor_code,
                            si_number,
                            branch_code,
                            file_size,
                            tran_type,
                            env,
                            uploaded_by,
                            row_count,
                            created_by,
                            upload_attempts,
                            status,
                            tran_date,
                            result
                        )
                        OUTPUT INSERTED.source_file_id
                        INTO @Inserted (source_file_id)
                        VALUES
                        (
                            @filename,
                            @vendor_code,
                            @si_number,
                            @branch_code,
                            @file_size,
                            @tran_type,
                            @env,
                            @uploaded_by,
                            @row_count,
                            @created_by,
                            @uploaded_attempts,
                            @status,
                            @tran_date,
                            @result
                        )

                        SELECT source_file_id
                        FROM @Inserted;
                    `);
            }, transaction)
            

            const sourceFileId = Number(result.recordset[0]?.source_file_id);
            
            const table = new sql.Table('ors_packing_list');

            table.columns.add('source_file_id', sql.BigInt, { nullable: false });
            table.columns.add('document_no', sql.VarChar(30), { nullable: false });
            table.columns.add('sales_invoice_no', sql.VarChar(30), { nullable: false });
            table.columns.add('ship_to_code', sql.VarChar(30), { nullable: true });
            table.columns.add('consignee', sql.NVarChar(100), { nullable: false });
            table.columns.add('uom', sql.VarChar(10), { nullable: true });
            table.columns.add('material', sql.NVarChar(60), { nullable: false });
            table.columns.add('size', sql.NVarChar(60), { nullable: false });
            table.columns.add('description', sql.NVarChar(200), { nullable: false });
            table.columns.add('served_qty', sql.Decimal(10, 0), { nullable: false });
            table.columns.add('carton_qty', sql.Decimal(4, 0), { nullable: true });
            table.columns.add('branch_code', sql.Int, { nullable: false });
            table.columns.add('vendor_code', sql.Int, { nullable: false });
            table.columns.add('env', sql.VarChar(10), { nullable: false });
            table.columns.add('status', sql.VarChar(100), { nullable: false });
            table.columns.add('reason', sql.NVarChar(sql.MAX), { nullable: true });
            
            for (const row of payload.rows) {
                table.rows.add(
                    Number(sourceFileId),
                    String(row.document_no),
                    String(row.sales_invoice_no),
                    String(row.ship_to_code),
                    row.consignee, 
                    row.uom,
                    row.material,
                    String(row.size),
                    row.description,
                    Number(row.served_qty),
                    Number(row.carton_qty),
                    Number(row.branch_code),
                    Number(row.vendor_code),
                    payload.env,
                    String(payload.status),
                    row.reason
                );
            }
            
            const bulkRequest = new sql.Request(transaction);
            const bulkResult = await bulkRequest.bulk(table);

            await transaction.commit(); 

            return result.recordset[0] ?? null;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findPlByFilename(filename: string): Promise<PLsList> {
        const db = await getDb();

        const result = await db
            .request()
            .input('filename', sql.VarChar, filename)
            .query(`
                SELECT *
                FROM ors_source_file
                WHERE filename = @filename
            `);

        return result.recordset[0] ?? null;
    }

    async deletePackingListBySourceFileId(sourceFileId: number,  transaction?: sql.Transaction): Promise<boolean> {
        const request = transaction
        ? new sql.Request(transaction)
        : (await getDb()).request();

        const result = await request
            .input('sourceFileId', sql.BigInt, sourceFileId)
            .query(`
                DELETE FROM ors_packing_list
                WHERE source_file_id = @sourceFileId
            `);

        return (result?.rowsAffected[0] ?? 0) > 0;
    }

    async plReUpload(payload: PlsCreate): Promise<boolean> {
        const db = await getDb();
        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            await this.deletePackingListBySourceFileId(payload.source_file_id, transaction);

            // const updateRequest = new sql.Request(transaction);
            
            const result = await withUserContext(payload.user_name, async (updateRequest) => {
                return await updateRequest

                    .input('source_file_id', sql.BigInt, payload.source_file_id)
                    .input('result', sql.VarChar, payload.result)
                    .input('uploaded_date', sql.DateTime, payload.uploaded_date)
                    .input('tran_date', sql.DateTime, payload.tran_date)
                    .input('upload_attempts', sql.Int, payload.uploaded_attempts)
                    .input('row_count', sql.Int, payload.row_count)
                    .input('file_size', sql.Int, payload.file_size) 
                    .input('status', sql.Int, payload.status) 

                    .query(`
                        UPDATE ors_source_file
                        SET 
                            result = @result,
                            uploaded_date = @uploaded_date,
                            tran_date = @tran_date,
                            upload_attempts = @upload_attempts,
                            row_count = @row_count,
                            file_size = @file_size,
                            status = @status
                        WHERE source_file_id = @source_file_id;
                    `);
            }, transaction)
            

            const sourceFileId = Number(payload.source_file_id);
            
            const table = new sql.Table('ors_packing_list');

            table.columns.add('source_file_id', sql.BigInt, { nullable: false });
            table.columns.add('document_no', sql.VarChar(30), { nullable: false });
            table.columns.add('sales_invoice_no', sql.VarChar(30), { nullable: false });
            table.columns.add('ship_to_code', sql.VarChar(30), { nullable: true });
            table.columns.add('consignee', sql.NVarChar(100), { nullable: false });
            table.columns.add('uom', sql.VarChar(10), { nullable: true });
            table.columns.add('material', sql.NVarChar(60), { nullable: false });
            table.columns.add('size', sql.NVarChar(60), { nullable: false });
            table.columns.add('description', sql.NVarChar(200), { nullable: false });
            table.columns.add('served_qty', sql.Decimal(10, 0), { nullable: false });
            table.columns.add('carton_qty', sql.Decimal(4, 0), { nullable: true });
            table.columns.add('branch_code', sql.Int, { nullable: false });
            table.columns.add('vendor_code', sql.Int, { nullable: false });
            table.columns.add('env', sql.VarChar(10), { nullable: false });
            table.columns.add('status', sql.VarChar(100), { nullable: false });
            table.columns.add('reason', sql.NVarChar(sql.MAX), { nullable: true });
            
            for (const row of payload.rows) {
                table.rows.add(
                    Number(sourceFileId),
                    String(row.document_no),
                    String(row.sales_invoice_no),
                    String(row.ship_to_code),
                    row.consignee, 
                    row.uom,
                    row.material,
                    String(row.size),
                    row.description,
                    Number(row.served_qty),
                    Number(row.carton_qty),
                    Number(row.branch_code),
                    Number(row.vendor_code),
                    payload.env,
                    String(payload.status),
                    row.reason
                );
            }
            
            const bulkRequest = new sql.Request(transaction);
            
            const bulkResult = await bulkRequest.bulk(table);

            const updated = (result.rowsAffected[0] ?? 0) > 0;

            await transaction.commit(); 

            return updated;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
