import sql from 'mssql';

// import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { InitialPlReceiving, InitialPlReceivingHasZero, InitialPlReceivingStatus, RowsUpdate } from './initialPlReceiving.types';
import { getDb } from '../../config/database';

export class InitialPlReceivingRepository {
    async initialPlReceiving({
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
    }: InitialPlReceiving) {

        const start = performance.now();

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
                        EXEC [dbo].[GetInitialPlReceivingDynamic] 
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

        const end = performance.now();

        console.log(`Execution time: ${end - start} ms`);

        return result.recordset;
    }

    async initialPlReceivingStatus({
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
    }: InitialPlReceivingStatus) {
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
                        EXEC [dbo].[GetInitialPlReceivingStatusPrc] 
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
    }: InitialPlReceivingStatus) {
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
                        EXEC [dbo].[GetInitialPlReceivingDynamic] 
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
    }: InitialPlReceivingStatus) {
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
                        EXEC [dbo].[GetInitialPlReceivingDynamic] 
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

    async plFiles(branch_id: number) {
        const db = await getDb();

        const result = await db
            .request()
            .input('branch_id', sql.Int, branch_id)
            .query(`
                SELECT source_file_id, filename, si_number, vendor_code
                FROM ors_source_file
                WHERE branch_code = @branch_id
                AND status = 2
            `);

        return result.recordset ?? null;
    }

    async getPlsFiles({branchId, env, user_name, status}: {branchId: number, env: string, user_name: string, status: number}) {
        const db = await getDb();

        const result = await db
            .request()
            .input('branch_id', sql.Int, branchId)
            .input('env', sql.VarChar, env)
            .input('user_name', sql.VarChar, user_name)
            .input('status', sql.Int, status)
            .query(`
               SELECT * FROM [dbo].[GetPlFilenameOrSiByUser] (@env, @user_name, @status) WHERE branch_code = @branch_id ORDER BY id
            `);

        return result.recordset ?? null;
    }

    async rowsUpdate(payload: RowsUpdate): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('pl_id', sql.VarChar, payload.pl_id)
            .input('actual_received', sql.Int, payload.actual_received)
            .input('status', sql.VarChar, payload.status)
            .input('received_date', sql.DateTime, payload.received_date)
            .input('received_by', sql.Int, payload.received_by) 
            .query(`
                UPDATE ors_packing_list
                SET 
                    initial_receipt_qty = @actual_received,
                    status = @status,
                    initial_received_by = @received_by,
                    initial_received_date = GETDATE()
                WHERE pl_id = @pl_id
            `)

    }

    async hasZero({
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
        }: InitialPlReceivingHasZero) {
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
                        EXEC [dbo].[GetInitialPlReceivingDynamic] 
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

    async toConfirm(payload: any): Promise<void> {
        const db = await getDb();

        const BATCH_SIZE = 500;

        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            let updated = 0;

            for (let offset = 0; offset < payload.rows.length; offset += BATCH_SIZE) {
                const batch = payload.rows.slice(offset, offset + BATCH_SIZE);

                const request = new sql.Request(transaction);

                request.input(`confirmed_receipt_by`, sql.Int, payload.confirmed_receipt_by);

                const values = batch.map((row: any, index: number) => {
                    request.input(`source_file_id_${index}`, sql.Int, Number(row.source_file_id));
                    request.input(`status_${index}`, sql.VarChar(50), payload.status);

                    return `(
                        @source_file_id_${index},
                        @status_${index}
                    )`;
                }).join(', ');

                // kulang pa ng initial_received_date

                const result = await request.query(`
                    UPDATE target
                    SET
                        target.status = source.status,
                        target.confirmed_receipt_by = @confirmed_receipt_by,
                        target.last_update_by = @confirmed_receipt_by,
                        target.last_update_date = GETDATE()
                        FROM ors_source_file AS target
                    INNER JOIN (
                        VALUES ${values}
                    ) AS source (
                        source_file_id,
                        status
                    )
                    ON source.source_file_id = target.source_file_id;
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

}

