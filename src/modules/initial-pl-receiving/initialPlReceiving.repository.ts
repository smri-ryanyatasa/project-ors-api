import sql from 'mssql';

// import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { InitialPlReceiving, InitialPlReceivingStatus } from './initialPlReceiving.types';
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

    async getPlsFiles({branchId, env, user_name}: {branchId: number, env: string, user_name: string}) {
        const db = await getDb();

        const result = await db
            .request()
            .input('branch_id', sql.Int, branchId)
            .input('env', sql.VarChar, env)
            .input('user_name', sql.VarChar, user_name)
            .input('status', sql.Int, 2)
            .query(`
               SELECT * FROM  [dbo].[GetPlFilenameOrSiByUser] (@env, @user_name, @status) WHERE branch_code = @branch_id ORDER BY id
            `);

        return result.recordset ?? null;
    }



}

