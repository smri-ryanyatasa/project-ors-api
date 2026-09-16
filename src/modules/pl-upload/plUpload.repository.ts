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
                    EXEC [dbo].[GetPlUploadListDynamic]
                        @Env            = @env,
                        @UserName       = @user_name, 
                        @PageNumber     = @page_number, 
                        @PageSize       = @page_size, 
                        @SearchText     = @search, 
                        @SortColumn     = @sort_column,
                        @SortOrder      = @sort_order, 
                        @FiltersJson    = @filters_json,
                        @BranchCode     = @branch_code
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
                    EXEC [dbo].[GetPlUploadlStatusPrc]
                        @Env            = @env,
                        @UserName       = @user_name, 
                        @SearchText     = @search, 
                        @SortColumn     = @sort_column,
                        @SortOrder      = @sort_order, 
                        @FiltersJson    = @filters_json,
                        @BranchCode     = @branch_code
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
                     EXEC [dbo].[GetPlUploadListDynamic]
                        @Env            = @env,
                        @UserName       = @user_name, 
                        @PageNumber     = @page_number, 
                        @PageSize       = @page_size, 
                        @SearchText     = @search, 
                        @SortColumn     = @sort_column,
                        @SortOrder      = @sort_order, 
                        @FiltersJson    = @filters_json,
                        @BranchCode     = @branch_code
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
                    EXEC [dbo].[GetPlUploadListDynamic]
                        @Env            = @env,
                        @UserName       = @user_name, 
                        @PageNumber     = @page_number, 
                        @PageSize       = @page_size, 
                        @SearchText     = @search, 
                        @SortColumn     = @sort_column,
                        @SortOrder      = @sort_order, 
                        @FiltersJson    = @filters_json,
                        @BranchCode     = @branch_code
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
                    String('1'),
                    row.reason
                );
            }
            
            const bulkRequest = new sql.Request(transaction);
            const bulkResult = await bulkRequest.bulk(table);

            await transaction.commit(); 

            return result.recordset[0] ?? null;
        } catch (error) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }

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

    // async checkInItem(materials: any[]) {
    //     const db = await getDb();

    //     const existingMaterials = new Set();

    //     const allResult: any[] = [];

    //     const batchSize = 500;

    //     for (let start = 0; start < materials.length; start += batchSize) {
    //         const batch = materials.slice(start, start + batchSize);

    //         const values = batch
    //             .map(
    //                 (_: any, index: number) =>
    //                     `(@material${index}, @size${index})`
    //             )
    //             .join(', ');

    //         const request = db.request();
        
    //         batch.forEach((item: any, index: number) => {
    //             request.input(`material${index}`, item.material);
    //             request.input(`size${index}`, item.size);
    //         });

    //         const result = await request.query(`
    //             SELECT 
    //                 v.material,
    //                 v.size,
    //                 i.primary_code,
    //                 i.alt_code,
    //                 i.status
    //             FROM (
    //                 VALUES ${values}
    //             ) AS v(material, size)
    //             INNER JOIN item i
    //                 ON i.style = v.material
    //                 AND i.size = v.size
    //         `);

    //         allResult.push(result.recordset);
            
    //         result.recordset.forEach((item: any) => {
    //             existingMaterials.add(
    //                 `${item.material?.toString().trim()}|${item.size?.toString().trim()}`
    //             );
    //         });
            
    //     }

    //     return {
    //         existingMaterials: existingMaterials,
    //         data: allResult
    //     }
    // }

    async checkInItem(materials: any[]) {
        const db = await getDb();

        const resultMap = new Map<string, any>();

        const batchSize = 500;

        for (let start = 0; start < materials.length; start += batchSize) {
            const batch = materials.slice(start, start + batchSize);

            const values = batch
                .map(
                    (_: any, index: number) =>
                        `(@material${index}, @size${index})`
                )
                .join(', ');

            const request = db.request();

            batch.forEach((item: any, index: number) => {
                request.input(`material${index}`, item.material);
                request.input(`size${index}`, item.size);
            });

            const result = await request.query(`
                SELECT
                    v.material,
                    v.size,
                    i.primary_vendor_code,
                    i.alt_vendor_name,
                    i.status
                FROM (
                    VALUES ${values}
                ) AS v(material, size)
                JOIN item i
                    ON i.style_code = v.material
                    AND i.size_dimension = v.size
            `);
            
            result.recordset.forEach((item: any) => {
                const material = item.material?.toString().trim();
                const size = item.size?.toString().trim();

                const key = `${material}|${size}`;

                const altCodes =
                    item.alt_vendor_name
                        ?.toString()
                        .split(',')
                        .map((value: any) =>
                            value.split(' - ')[0].trim()
                        )
                        .filter(Boolean) ?? [];

                resultMap.set(key, {
                    material,
                    size,
                    primary_vendor_code: item.primary_vendor_code?.toString().trim() || null,
                    alt_vendor_name: altCodes,
                    status: item.status?.toString().trim(),
                });
            });
        }

        return resultMap;
    }

    async checkVendorTagInItem(vcodes: any) {
        const db = await getDb();

        const vcodeTags = new Map();

        const batchSize = 500;

        for (let start = 0; start < vcodes.length; start += batchSize) {
            const batch = vcodes.slice(start, start + batchSize);

            const vcodeValues = batch
                .map(
                    (_: any, index: number) =>
                        `(@vcode${index})`
                )
                .join(', ');

            const vcodeRequest = db.request();

            batch.forEach((vcode: any, index: number) => {
                vcodeRequest.input(`vcode${index}`, vcode);
            });

            const vcodeResult = await vcodeRequest.query(`
                SELECT
                        v.vcode,
                        CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM item i
                                WHERE LTRIM(RTRIM(i.primary_vendor_code)) = LTRIM(RTRIM(v.vcode))
                            )
                            THEN 'primary'

                            WHEN EXISTS (
                                SELECT 1
                                FROM item i
                                WHERE LTRIM(RTRIM(
                                    LEFT(i.alt_vendor_name, CHARINDEX(' - ', i.alt_vendor_name + ' - ') - 1)
                                )) = LTRIM(RTRIM(v.vcode))
                            )
                            THEN 'alternative'

                            ELSE ''
                        END AS tag
                    FROM (
                        VALUES ${vcodeValues}
                    ) AS v(vcode)
            `);

            vcodeResult.recordset.forEach((item: any) => {
                vcodeTags.set(
                    item.vcode?.toString().trim(),
                    item.tag
                );
            });
        }

    return vcodeTags;

    }
}
