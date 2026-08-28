import sql from 'mssql';

// import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { ReceivingReport, ReceivingReportStatus, ReceivingReportCsvExport, ReceivingReportExcelExport } from './receivingReport.types';

export class ReceivingReportRepository {
    async receivingReport({
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
    }: ReceivingReport) {

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
                .input('initialReceiptStartDate', sql.VarChar, initialReceiptStartDate ?? null)
                .input('initialReceiptEndDate', sql.VarChar, initialReceiptEndDate ?? null)
                .input('finalReceiptStartDate', sql.VarChar, finalReceiptStartDate ?? null)
                .input('finalReceiptEndDate', sql.VarChar, finalReceiptEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetReceivingReportDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @PageNumber                   = @page_number, 
                            @PageSize                     = @page_size, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @InitialReceiptStartDate      = @initialReceiptStartDate,
                            @InitialReceiptEndDate        = @initialReceiptEndDate,
                            @FinalReceiptStartDate        = @finalReceiptStartDate,
                            @FinalReceiptEndDate          = @finalReceiptEndDate;
                `);
        });

        return result.recordset;
    }

    async receivingReportStatus({
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
    }: ReceivingReportStatus) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('branch', sql.Int, branch ?? null)
                .input('initialReceiptStartDate', sql.VarChar, initialReceiptStartDate ?? null)
                .input('initialReceiptEndDate', sql.VarChar, initialReceiptEndDate ?? null)
                .input('finalReceiptStartDate', sql.VarChar, finalReceiptStartDate ?? null)
                .input('finalReceiptEndDate', sql.VarChar, finalReceiptEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetReceivingReportStatusPrc] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @InitialReceiptStartDate      = @initialReceiptStartDate,
                            @InitialReceiptEndDate        = @initialReceiptEndDate,
                            @FinalReceiptStartDate        = @finalReceiptStartDate,
                            @FinalReceiptEndDate          = @finalReceiptEndDate;
                `);
        });
        
        return result.recordset;
    }

    async csvExport({
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
    }: ReceivingReportStatus) {
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
                .input('initialReceiptStartDate', sql.VarChar, initialReceiptStartDate ?? null)
                .input('initialReceiptEndDate', sql.VarChar, initialReceiptEndDate ?? null)
                .input('finalReceiptStartDate', sql.VarChar, finalReceiptStartDate ?? null)
                .input('finalReceiptEndDate', sql.VarChar, finalReceiptEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetReceivingReportDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @PageNumber                   = @page_number, 
                            @PageSize                     = @page_size, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @InitialReceiptStartDate      = @initialReceiptStartDate,
                            @InitialReceiptEndDate        = @initialReceiptEndDate,
                            @FinalReceiptStartDate        = @finalReceiptStartDate,
                            @FinalReceiptEndDate          = @finalReceiptEndDate;
                `);
        });
        
        return result.recordset;
    }

    async excelExport({
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
    }: ReceivingReportStatus) {
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
                .input('initialReceiptStartDate', sql.VarChar, initialReceiptStartDate ?? null)
                .input('initialReceiptEndDate', sql.VarChar, initialReceiptEndDate ?? null)
                .input('finalReceiptStartDate', sql.VarChar, finalReceiptStartDate ?? null)
                .input('finalReceiptEndDate', sql.VarChar, finalReceiptEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetReceivingReportDynamic] 
                            @Env                          = @env,
                            @UserName                     = @user_name, 
                            @PageNumber                   = @page_number, 
                            @PageSize                     = @page_size, 
                            @SearchText                   = @search, 
                            @SortColumn                   = @sort_column, 
                            @SortOrder                    = @sort_order, 
                            @FiltersJson                  = @filters_json,
                            @BranchCode                   = @branch,
                            @InitialReceiptStartDate      = @initialReceiptStartDate,
                            @InitialReceiptEndDate        = @initialReceiptEndDate,
                            @FinalReceiptStartDate        = @finalReceiptStartDate,
                            @FinalReceiptEndDate          = @finalReceiptEndDate;
                `);
        });

        return result.recordset;
    }




}

