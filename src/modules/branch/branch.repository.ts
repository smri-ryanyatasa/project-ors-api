import sql from 'mssql';

import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';
import type { Branch, BranchCsvExport } from './branch.types';

export class BranchRepository {
    async branches({
        user_name, 
        env, 
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: Branch) {
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
                .query(`
                    EXEC [dbo].[GetBranchListDynamic] 
                        @Env         = @env,
                        @UserName    = @user_name, 
                        @PageNumber  = @page_number, 
                        @PageSize    = @page_size, 
                        @SearchText  = @search, 
                        @SortColumn  = @sort_column,
                        @SortOrder   = @sort_order, 
                        @FiltersJson = @filters_json     
                `);
        });

        return result.recordset;
    }
    
    async csvExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: BranchCsvExport) {
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
                .query(`
                    EXEC [dbo].[GetBranchListDynamic] 
                        @Env         = @env,
                        @UserName    = @user_name, 
                        @PageNumber  = @page_number, 
                        @PageSize    = @page_size, 
                        @SearchText  = @search, 
                        @SortColumn  = @sort_column,
                        @SortOrder   = @sort_order, 
                        @FiltersJson = @filters_json     
                `);
        });
        
        return result.recordset;
    }

    async excelExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: BranchCsvExport) {
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
                .query(`
                    EXEC [dbo].[GetBranchListDynamic] 
                        @Env         = @env,
                        @UserName    = @user_name, 
                        @PageNumber  = @page_number, 
                        @PageSize    = @page_size, 
                        @SearchText  = @search, 
                        @SortColumn  = @sort_column,
                        @SortOrder   = @sort_order, 
                        @FiltersJson = @filters_json     
                `);
        });
        
        return result.recordset;
    }
}
