import sql from 'mssql';

import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { PlsUpload, PlsUploadStatus, PlsUploadLogs, PLsList } from './plUpload.types';

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
    }
}
