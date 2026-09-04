import sql from 'mssql';

import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';
import type { Item, ItemCsvExport } from './item.types';

export class ItemRepository {

    async fetchItems({env, page, pageSize, search, filterModel, sortModel}: {env: any, page: any, pageSize: any, search: any, filterModel: any, sortModel: any}) {
        const db = await getDb();
        
        const offset = (page - 1) * pageSize;

        const conditions: string[] = [];

        const fields = {
            style_code: 'i.style_code',
            style_name: 'i.style_name',
            sku_code: 'i.sku_code',
            sku_name: 'i.sku_name',
            upc: 'i.upc',
            primary_vendor_code: 'i.primary_vendor_code',
            primary_vendor_name: 'i.primary_vendor_name',
            alt_vendor_code: 'i.alt_vendor_code',
            alt_vendor_name: 'i.alt_vendor_name',
            dept_code: 'i.dept_code',
            dept_name: 'i.dept_name',
            subdept_code: 'i.subdept_code',
            subdept_name: 'i.subdept_name',
            class_code: 'i.class_code',
            class_name: 'i.class_name',
            subclass_code: 'i.subclass_code',
            subclass_name: 'i.subclass_name',
            buying_uom: 'i.buying_uom',
            color: 'i.color',
            size_dimension: 'i.size_dimension',
            curr_regular_retail: 'i.curr_regular_retail',
            status: 'i.status',
        }

        const allowedFields: Record<string, string> = fields

        const allowedSortFields: Record<string, string> = fields

        // ======================================
        // SEARCH INPUT / QUICK FILTER
        // ======================================
        if (search?.trim()) {
            conditions.push(`
                (
                    i.style_code LIKE @search
                    OR i.style_name LIKE @search
                    OR i.sku_code LIKE @search
                    OR i.sku_name LIKE @search
                    OR i.upc LIKE @search
                    OR i.primary_vendor_code LIKE @search
                    OR i.primary_vendor_name LIKE @search
                    OR i.alt_vendor_code LIKE @search
                    OR i.alt_vendor_name LIKE @search
                )
            `);
        }

        // ======================================
        // USERS QUERY
        // ======================================
        const request = db
            .request()
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, pageSize);

        // ======================================
        // COLUMN FILTERS
        // ======================================
        filterModel.forEach((filter: any, index: any) => {
            const column = allowedFields[filter.field];

            if (!column) return;

            const parameterName = `filterValue${index}`;

            let condition: string;
            let parameterValue: string;

            switch (filter.operator) {
                case 'equals':
                    if (!filter.value) return;

                    condition = `${column} = @${parameterName}`;
                    parameterValue = filter.value;
                    break;

                case 'doesNotEqual':
                    if (!filter.value) return;

                    condition = `${column} <> @${parameterName}`;
                    parameterValue = filter.value;
                    break;

                case 'contains':
                    if (!filter.value) return;

                    condition = `${column} LIKE @${parameterName}`;
                    parameterValue = `%${filter.value}%`;
                    break;

                case 'startsWith':
                    if (!filter.value) return;

                    condition = `${column} LIKE @${parameterName}`;
                    parameterValue = `${filter.value}%`;
                    break;

                case 'endsWith':
                    if (!filter.value) return;

                    condition = `${column} LIKE @${parameterName}`;
                    parameterValue = `%${filter.value}`;
                    break;

                case 'isEmpty':
                    conditions.push(`(${column} IS NULL OR ${column} = '')`);
                    return;

                case 'isNotEmpty':
                    conditions.push(`(${column} IS NOT NULL AND ${column} <> '')`);
                    return;

                case 'isAnyOf':
                    if (!Array.isArray(filter.value) || filter.value.length === 0) return;

                    const values = filter.value
                        .map((item: any) => `'${String(item).replace(/'/g, "''")}'`)
                        .join(', ');

                    conditions.push(`${column} IN (${values})`);
                    return;

                default:
                    return;
            }

            conditions.push(condition);

            request.input(
                parameterName,
                sql.VarChar,
                parameterValue
            );
        });

        if (env?.trim()) {
            conditions.push('i.env = @env');
            request.input('env', sql.VarChar, env);
        }

        // ======================================
        // WHERE CLAUSE
        // ======================================
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // Search parameter
        if (search?.trim()) {
            request.input(
                'search',
                sql.VarChar,
                `${search.trim()}%`
            );
        }

        // ======================================
        // SORTING QUERY
        // ======================================
        let orderBy = 'i.style_name ASC';

        if (sortModel.length > 0) {
            const sort = sortModel[0];

            const column = allowedSortFields[sort.field];

            if (column) {
                const direction = sort.sort === 'desc'
                    ? 'DESC'
                    : 'ASC';

                orderBy = `${column} ${direction}`;
            }
        }
        
        const result = await request.query(`
            SELECT i.*			
            FROM item AS i
            ${whereClause}

            ORDER BY ${orderBy}
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY;
        `);

        // ======================================
        // COUNT QUERY
        // ======================================
        const countRequest = db.request();

        if (env !== null && env !== '') {
            countRequest.input('env', sql.VarChar, env);
        }

        // Search parameter
        if (search?.trim()) {
            countRequest.input(
                'search',
                sql.VarChar,
                `${search.trim()}%`
            );
        }

        // Column filter parameters
        filterModel.forEach((filter: any, index: any) => {
            if (!filter.value) return;

            const column = allowedFields[filter.field];

            if (!column) return;

            const parameterName = `filterValue${index}`;

            countRequest.input(
                parameterName,
                sql.VarChar,
                `%${filter.value}%`
            );
        });

        const countResult = await countRequest.query<{ total: number }>(`
            SELECT COUNT(*) AS total
            FROM item AS i
            ${whereClause}
        `);

        return {
            data: result.recordset,
            total: countResult.recordset[0]?.total ?? 0,
        };
    }


    async items({
        user_name, 
        env, 
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: Item) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('Env', sql.VarChar, env)
                .input('UserName', sql.VarChar, user_name)
                .input('PageNumber', sql.Int, page)
                .input('PageSize', sql.Int, pageSize)
                .input('SearchText', sql.VarChar, search)
                .input('SortColumn', sql.VarChar, sortColum)
                .input('SortOrder', sql.VarChar, sortOrder)
                .input('FiltersJson', sql.VarChar, `${filterModel}`)
                .execute('GetItemListDynamic');
                // .query(`
                //     SELECT * 
                //         FROM dbo.[EXEC dbo.GetItemListDynamic ]
                //         (
                //             @env,
                //             @user_name, 
                //             @page_number, 
                //             @page_size, 
                //             @search, 
                //             @sort_column, 
                //             @sort_order, 
                //             @filters_json
                //         );
                // `);
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
    }: ItemCsvExport) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('Env', sql.VarChar, env)
                .input('UserName', sql.VarChar, user_name)
                .input('PageNumber', sql.Int, 1)
                .input('PageSize', sql.Int, 100000)
                .input('SearchText', sql.VarChar, search)
                .input('SortColumn', sql.VarChar, sortColum)
                .input('SortOrder', sql.VarChar, sortOrder)
                .input('FiltersJson', sql.VarChar, `${filterModel}`)
                .execute('GetItemListDynamic');
                // .query(`
                //     SELECT * 
                //         FROM dbo.[GetItemListDynamic]
                //         (
                //             @env,
                //             @user_name, 
                //             @page_number, 
                //             @page_size, 
                //             @search, 
                //             @sort_column, 
                //             @sort_order, 
                //             @filters_json
                //         );
                // `);
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
    }: ItemCsvExport) {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('Env', sql.VarChar, env)
                .input('UserName', sql.VarChar, user_name)
                .input('PageNumber', sql.Int, 1)
                .input('PageSize', sql.Int, 100000)
                .input('SearchText', sql.VarChar, search)
                .input('SortColumn', sql.VarChar, sortColum)
                .input('SortOrder', sql.VarChar, sortOrder)
                .input('FiltersJson', sql.VarChar, `${filterModel}`)
                .execute('GetItemListDynamic');
                // .query(`
                //     SELECT * 
                //         FROM dbo.[GetItemListDynamic]
                //         (
                //             @env,
                //             @user_name, 
                //             @page_number, 
                //             @page_size, 
                //             @search, 
                //             @sort_column, 
                //             @sort_order, 
                //             @filters_json
                //         );
                // `);
        });
        
        return result.recordset;
    }

    async itemRowsUpdate(payload: any): Promise<void> {
        const db = await getDb();
        const batchId = crypto.randomUUID();

        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);

            const table = new sql.Table('dbo.ItemRowsUpdateStaging');

            table.columns.add('batch_id', sql.UniqueIdentifier, { nullable: false, });
            table.columns.add('id', sql.Int, { nullable: false, });
            table.columns.add('alt_vendor_code', sql.VarChar(30), { nullable: true, });
            table.columns.add('alt_vendor_name', sql.VarChar(255), { nullable: true, });

            for (const row of payload) {
                table.rows.add(
                    batchId,
                    row.id,
                    row.alt_vendor_code ?? null,
                    row.alt_vendor_name ?? null
                );
            }

            await request.bulk(table);

            await request.query(`
                UPDATE s
                SET
                    s.alt_vendor_code = u.alt_vendor_code,
                    s.alt_vendor_name = u.alt_vendor_name
                FROM dbo.item AS s
                INNER JOIN dbo.ItemRowsUpdateStaging AS u
                    ON u.id = s.id
                    AND u.batch_id = '${batchId}';
            `);

            await request.query(`
                DELETE FROM dbo.ItemRowsUpdateStaging
                WHERE batch_id = '${batchId}';
            `);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
