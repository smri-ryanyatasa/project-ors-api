import sql from 'mssql';

import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { FinalPlReceiving, FinalPlReceivingStatus, FinalPlReceivingCsvExport, FinalPlReceivingExcelExport, ToApprove } from './finalPlReceiving.types';

export class FinalPlReceivingRepository {
    async finalPlReceiving({
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
    }: FinalPlReceiving) {

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
                .input('branch', sql.Int, branch ?? null)
                .input('filename', sql.VarChar, filename ?? null)
                .input('vendor_code', sql.VarChar, vendor_code ?? null)
                .input('si_number', sql.Int, si_number ?? null)
                .query(`
                        EXEC [dbo].[GetFinalPlReceivingDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @PageNumber                   = @page_number, 
                            @PageSize                     = @page_size, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @FileName                     = @filename,
                            @VendorCode                   = @vendor_code,
                            @SalesInvoice                 = @si_number;
                `);
        });

        return result.recordset;
    }

    async finalPlReceivingStatus({
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
    }: FinalPlReceivingStatus) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch', sql.Int, branch ?? null)
                .input('filename', sql.VarChar, filename ?? null)
                .input('vendor_code', sql.VarChar, vendor_code ?? null)
                .input('si_number', sql.Int, si_number ?? null)
                .query(`
                        EXEC [dbo].[GetFinalPlReceivingStatusPrc] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @FileName                     = @filename,
                            @VendorCode                   = @vendor_code,
                            @SalesInvoice                 = @si_number;
                `);
        });
        
        return result.recordset;
    }

    async csvExport({
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
    }: FinalPlReceivingCsvExport) {
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
                .input('branch', sql.Int, branch ?? null)
                .input('filename', sql.VarChar, filename ?? null)
                .input('vendor_code', sql.VarChar, vendor_code ?? null)
                .input('si_number', sql.Int, si_number ?? null)
                .query(`
                        EXEC [dbo].[GetFinalPlReceivingDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @PageNumber                   = @page_number, 
                            @PageSize                     = @page_size, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @FileName                     = @filename,
                            @VendorCode                   = @vendor_code,
                            @SalesInvoice                 = @si_number;
                `);
        });
        
        return result.recordset;
    }

    async excelExport({
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
    }: FinalPlReceivingExcelExport) {
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
                .input('branch', sql.Int, branch ?? null)
                .input('filename', sql.VarChar, filename ?? null)
                .input('vendor_code', sql.VarChar, vendor_code ?? null)
                .input('si_number', sql.Int, si_number ?? null)
                .query(`
                        EXEC [dbo].[GetFinalPlReceivingDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @PageNumber                   = @page_number, 
                            @PageSize                     = @page_size, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @FileName                     = @filename,
                            @VendorCode                   = @vendor_code,
                            @SalesInvoice                 = @si_number;
                `);
        });

        return result.recordset;
    }

    async checkIfAlreadyApprovedReceipt(rows: any) {
        const db = await getDb();

        const sourceFileIds = [...new Set(
            rows.map((row: any) => Number(row.source_file_id))
        )];

        const result = await db
            .request()
            .input('source_file_ids', sql.NVarChar(sql.MAX), sourceFileIds.join(','))
            .query(`
                SELECT COUNT(DISTINCT source_file_id) AS existing_count
                FROM ors_source_file
                WHERE source_file_id IN (
                    SELECT TRY_CAST(value AS INT)
                        FROM STRING_SPLIT(@source_file_ids, ',')
                    )
                AND status = 3
            `);

        const existingCount = result.recordset[0].existing_count;

        const allExist = existingCount === sourceFileIds.length;

        return allExist;
    }

    async rowsUpdate(payload: any): Promise<void> {
        const db = await getDb();

        const BATCH_SIZE = 200;

        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();
            
            let updated = 0;

            for (let offset = 0; offset < payload.rows.length; offset += BATCH_SIZE) {
                const batch = payload.rows.slice(offset, offset + BATCH_SIZE);

                const request = new sql.Request(transaction);

                request.input('received_by', sql.Int, payload.received_by);

                const values = batch
                    .map((row: any, index: number) => {
                        request.input(`pl_id_${index}`, sql.Int, Number(row.pl_id));
                        request.input(`initial_qty_${index}`, sql.Int, row.initial_qty);
                        request.input(`final_qty_${index}`, sql.Int, row.final_qty);

                        return `(
                            @pl_id_${index},
                            @initial_qty_${index},
                            @final_qty_${index}
                        )`;
                    })
                    .join(', ');

                const result = await request.query(`
                    UPDATE target
                    SET
                        target.initial_receipt_qty = source.initial_qty,
                        target.final_receipt_qty = source.final_qty,
                        target.final_received_by = @received_by,
                        target.final_received_date = GETDATE(),
                        target.last_update_date = GETDATE()
                    FROM ors_packing_list AS target
                    INNER JOIN (
                        VALUES ${values}
                    ) AS source (
                        pl_id,
                        initial_qty,
                        final_qty
                    )
                    ON source.pl_id = target.pl_id;
                `);

                updated += result.rowsAffected[0] ?? 0;
            }

            await transaction.commit();


        } catch (error) {
            try {
                await transaction.rollback();
            } catch {}

            throw error;
        }
    }
    
    async toApproved({
        user_name, 
        env, 
        branch,
        filename,
        vendor_code,
        si_number,
        search, 
        sortColum, 
        sortOrder,
        filterModel,
    }: ToApprove) {

        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch', sql.Int, branch ?? null)
                .input('filename', sql.VarChar, filename ?? null)
                .input('vendor_code', sql.VarChar, vendor_code ?? null)
                .input('si_number', sql.Int, si_number ?? null)
                .query(`
                        EXEC [dbo].[GetFinalPlReceivingDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @FileName                     = @filename,
                            @VendorCode                   = @vendor_code,
                            @SalesInvoice                 = @si_number;
                `);
        });

        return result.recordset;
    }

    async approvedUpdate(rows: any, status: string, last_update_by: number): Promise<Boolean> {
        const db = await getDb();
        
        const BATCH_SIZE = 500;

        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            let updated = 0;

            for (let offset = 0; offset < rows.length; offset += BATCH_SIZE) {
                const batch = rows.slice(offset, offset + BATCH_SIZE);

                const request = new sql.Request(transaction);

                request.input(`last_update_by`, sql.Int, last_update_by);
                request.input(`status`, sql.VarChar(50), status);

                const values = batch.map((row: any, index: number) => {
                    request.input(`source_file_id_${index}`, sql.Int, Number(row.source_file_id));

                    return `(
                        @source_file_id_${index}
                    )`;
                }).join(', ');

                const result = await request.query(`
                    UPDATE target
                    SET
                        target.status = @status,
                        target.last_update_by = @last_update_by,
                        target.approved_receipt_by = @last_update_by,
                        target.last_update_date = GETDATE()
                        FROM ors_source_file AS target
                    INNER JOIN (
                        VALUES ${values}
                    ) AS source (
                        source_file_id
                    )
                    ON source.source_file_id = target.source_file_id;
                `);

                updated += result.rowsAffected[0] ?? 0;
            }

            await transaction.commit();

            return true;

        } catch (error) {
            try {
                await transaction.rollback();
            } catch {}

            throw error;
        }
    }

}

