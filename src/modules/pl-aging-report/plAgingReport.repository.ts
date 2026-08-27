import sql from 'mssql';

// import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { PlAgingReport, PlAgingReportStatus } from './plAgingReport.types';

export class PlAgingReportRepository {
    async plAgingReport({
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
    }: PlAgingReport) {

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
                .input('uploadedStartDate', sql.VarChar, uploadedStartDate ?? null)
                .input('uploadedEndDate', sql.VarChar, uploadedEndDate ?? null)
                .input('initialStartDate', sql.VarChar, initialStartDate ?? null)
                .input('initialEndDate', sql.VarChar, initialEndDate ?? null)
                .input('approveReceiptStartDate', sql.VarChar, approveReceiptStartDate ?? null)
                .input('approveReceiptEndDate', sql.VarChar, approveReceiptEndDate ?? null)
                .input('poGeneratedStartDate', sql.VarChar, poGeneratedStartDate ?? null)
                .input('poGeneratedEndDate', sql.VarChar, poGeneratedEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetPlAgingReportDynamic] 
                            @Env = @env,
                            @UserName = @user_name, 
                            @PageNumber = @page_number, 
                            @PageSize = @page_size, 
                            @SearchText = @search, 
                            @SortColumn = @sort_column, 
                            @SortOrder = @sort_order,
                            @FiltersJson = @filters_json,
                            @UploadedStartDate = @uploadedStartDate,
                            @UploadedEndDate = @uploadedEndDate,
                            @InitialStartDate = @initialStartDate,
                            @InitialEndDate = @initialEndDate,
                            @ApproveReceiptStartDate = @approveReceiptStartDate,
                            @ApproveReceiptEndDate = @approveReceiptEndDate,
                            @PoGeneratedStartDate = @poGeneratedStartDate,
                            @PoGeneratedEndDate = @poGeneratedEndDate;
                `);
        });

        return result.recordset;
    }

    async plAgingReportStatus({
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
    }: PlAgingReportStatus) {

        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('env', sql.VarChar, env)
                .input('user_name', sql.VarChar, user_name)
                .input('search', sql.VarChar, search)
                .input('sort_column', sql.VarChar, sortColum)
                .input('sort_order', sql.VarChar, sortOrder)
                .input('filters_json', sql.VarChar, `${filterModel}`)
                .input('uploadedStartDate', sql.VarChar, uploadedStartDate ?? null)
                .input('uploadedEndDate', sql.VarChar, uploadedEndDate ?? null)
                .input('initialStartDate', sql.VarChar, initialStartDate ?? null)
                .input('initialEndDate', sql.VarChar, initialEndDate ?? null)
                .input('approveReceiptStartDate', sql.VarChar, approveReceiptStartDate ?? null)
                .input('approveReceiptEndDate', sql.VarChar, approveReceiptEndDate ?? null)
                .input('poGeneratedStartDate', sql.VarChar, poGeneratedStartDate ?? null)
                .input('poGeneratedEndDate', sql.VarChar, poGeneratedEndDate ?? null)
                .query(`
                    EXEC [dbo].[GetPlAgingReportStatusPrc] 
                            @Env = @env,
                            @UserName = @user_name, 
                            @SearchText = @search, 
                            @SortColumn = @sort_column, 
                            @SortOrder = @sort_order,
                            @FiltersJson = @filters_json,
                            @UploadedStartDate = @uploadedStartDate,
                            @UploadedEndDate = @uploadedEndDate,
                            @InitialStartDate = @initialStartDate,
                            @InitialEndDate = @initialEndDate,
                            @ApproveReceiptStartDate = @approveReceiptStartDate,
                            @ApproveReceiptEndDate = @approveReceiptEndDate,
                            @PoGeneratedStartDate = @poGeneratedStartDate,
                            @PoGeneratedEndDate = @poGeneratedEndDate;
                `);
        });
        
        return result.recordset;
    }

    async csvExport({
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
    }: PlAgingReportStatus) {
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
                .input('uploadedStartDate', sql.VarChar, uploadedStartDate ?? null)
                .input('uploadedEndDate', sql.VarChar, uploadedEndDate ?? null)
                .input('initialStartDate', sql.VarChar, initialStartDate ?? null)
                .input('initialEndDate', sql.VarChar, initialEndDate ?? null)
                .input('approveReceiptStartDate', sql.VarChar, approveReceiptStartDate ?? null)
                .input('approveReceiptEndDate', sql.VarChar, approveReceiptEndDate ?? null)
                .input('poGeneratedStartDate', sql.VarChar, poGeneratedStartDate ?? null)
                .input('poGeneratedEndDate', sql.VarChar, poGeneratedEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetPlAgingReportDynamic] 
                            @Env = @env,
                            @UserName = @user_name, 
                            @PageNumber = @page_number, 
                            @PageSize = @page_size, 
                            @SearchText = @search, 
                            @SortColumn = @sort_column, 
                            @SortOrder = @sort_order,
                            @FiltersJson = @filters_json,
                            @UploadedStartDate = @uploadedStartDate,
                            @UploadedEndDate = @uploadedEndDate,
                            @InitialStartDate = @initialStartDate,
                            @InitialEndDate = @initialEndDate,
                            @ApproveReceiptStartDate = @approveReceiptStartDate,
                            @ApproveReceiptEndDate = @approveReceiptEndDate,
                            @PoGeneratedStartDate = @poGeneratedStartDate,
                            @PoGeneratedEndDate = @poGeneratedEndDate;
                `);
        });
        
        return result.recordset;
    }

    async excelExport({
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
    }: PlAgingReportStatus) {
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
                .input('uploadedStartDate', sql.VarChar, uploadedStartDate ?? null)
                .input('uploadedEndDate', sql.VarChar, uploadedEndDate ?? null)
                .input('initialStartDate', sql.VarChar, initialStartDate ?? null)
                .input('initialEndDate', sql.VarChar, initialEndDate ?? null)
                .input('approveReceiptStartDate', sql.VarChar, approveReceiptStartDate ?? null)
                .input('approveReceiptEndDate', sql.VarChar, approveReceiptEndDate ?? null)
                .input('poGeneratedStartDate', sql.VarChar, poGeneratedStartDate ?? null)
                .input('poGeneratedEndDate', sql.VarChar, poGeneratedEndDate ?? null)
                .query(`
                        EXEC [dbo].[GetPlAgingReportDynamic] 
                            @Env = @env,
                            @UserName = @user_name, 
                            @PageNumber = @page_number, 
                            @PageSize = @page_size, 
                            @SearchText = @search, 
                            @SortColumn = @sort_column, 
                            @SortOrder = @sort_order,
                            @FiltersJson = @filters_json,
                            @UploadedStartDate = @uploadedStartDate,
                            @UploadedEndDate = @uploadedEndDate,
                            @InitialStartDate = @initialStartDate,
                            @InitialEndDate = @initialEndDate,
                            @ApproveReceiptStartDate = @approveReceiptStartDate,
                            @ApproveReceiptEndDate = @approveReceiptEndDate,
                            @PoGeneratedStartDate = @poGeneratedStartDate,
                            @PoGeneratedEndDate = @poGeneratedEndDate;
                `);
        });

        return result.recordset;
    }




}

