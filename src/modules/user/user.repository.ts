import sql from 'mssql';

import { getDb  } from '../../config/database';
import type { User, UserFilter } from './user.types';
import { type CreateUserSchemaType, type UpdateUserSchemaType, type BulkUserUploadSchemaType} from './user.schema';

export class UserRepository {
    async findAll({
        page,
        pageSize,
        search,
        filterModel,
        sortModel
    }: {
        page: number;
        pageSize: number;
        search: string;
        filterModel: UserFilter[];
        sortModel: any
    }): Promise<{
        data: User[];
        total: number;
    }>  {
        const db = await getDb();

        const offset = (page - 1) * pageSize;

        const conditions: string[] = [];

        const fields = {
            user_name: 'user_name',
            full_name: 'full_name',
            description: 'description',
            position: 'position',
            email_address: 'email_address',
            mms: 'mms',
            env: 'env',
            branches: 'branches',
            status: 'status',
            business_unit: 'business_unit',
        }

        const allowedFields: Record<string, string> = fields

        const allowedSortFields: Record<string, string> = fields

        // ======================================
        // SEARCH INPUT / QUICK FILTER
        // ======================================
        if (search?.trim()) {
            conditions.push(`
                (
                    user_name LIKE @search
                    OR full_name LIKE @search
                )
            `);
        }

        // ======================================
        // COLUMN FILTERS
        // ======================================
        filterModel.forEach((filter, index) => {
            if (!filter.value) return;

            const column = allowedFields[filter.field];

            if (!column) return;

            const parameterName = `filterValue${index}`;

            conditions.push(`${column} LIKE @${parameterName}`);
        });

        // ======================================
        // WHERE CLAUSE
        // ======================================
        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // ======================================
        // USERS QUERY
        // ======================================
        const request = db
            .request()
            .input('offset', sql.Int, offset)
            .input('pageSize', sql.Int, pageSize);

        // Search parameter
        if (search?.trim()) {
            request.input(
                'search',
                sql.VarChar,
                `%${search.trim()}%`
            );
        }

        // ======================================
        // SORTING QUERY
        // ======================================
        let orderBy = 'user_name ASC';

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

        // Column filter parameters
        filterModel.forEach((filter, index) => {
            if (!filter.value) return;

            const column = allowedFields[filter.field];

            if (!column) return;

            const parameterName = `filterValue${index}`;

            request.input(
                parameterName,
                sql.VarChar,
                `%${filter.value}%`
            );
        });

        const usersResult = await request.query<User>(`
            SELECT
                user_id,
                user_name,
                full_name,
                description,
                position,
                email_address,
                mms,
                env,
                branches,
                status,
                business_unit
            FROM users
            ${whereClause}
            ORDER BY ${orderBy}
            OFFSET @offset ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `);

        // ======================================
        // COUNT QUERY
        // ======================================
        const countRequest = db.request();

        // Search parameter
        if (search?.trim()) {
            countRequest.input(
                'search',
                sql.VarChar,
                `%${search.trim()}%`
            );
        }

        // Column filter parameters
        filterModel.forEach((filter, index) => {
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
            FROM users
            ${whereClause}
        `);

        return {
            data: usersResult.recordset,
            total: countResult.recordset[0]?.total ?? 0,
        };
    }

    async findById(userId: number): Promise<User | null> {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT *
                FROM users
                WHERE user_id = @user_id
            `);

        return result.recordset[0] ?? null;
    }

    async findByUsername(userName: string): Promise<User | null> {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_name', sql.VarChar, userName)
            .query(`
                SELECT *
                FROM users
                WHERE user_name = @user_name
            `);

        return result.recordset[0] ?? null;
    }

    async create(payload: CreateUserSchemaType): Promise<User> {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_name', sql.VarChar, payload.user_name)
            .input('password', sql.VarChar, payload.password)
            .input('full_name', sql.VarChar, payload.full_name)
            .input('description', sql.VarChar, payload.description)
            .input('position', sql.VarChar, payload.position)
            .input('email_address', sql.VarChar, payload.email_address)
            .input('mms', sql.VarChar, payload.mms)
            .input('env', sql.VarChar, payload.env)
            .input('branches', sql.VarChar, payload.branches)
            .input('status', sql.VarChar, payload.status)
            .input('business_unit', sql.VarChar, payload.business_unit)
            .input('created_by', sql.Int, payload.created_by)
            .query(`    
                INSERT INTO users
                (
                    user_name,
                    password,
                    full_name,
                    description,
                    position,
                    email_address,
                    mms,
                    env,
                    branches,
                    status,
                    business_unit,
                    created_by
                )
                VALUES
                (
                    @user_name,
                    @password,
                    @full_name,
                    @description,
                    @position,
                    @email_address,
                    @mms,
                    @env,
                    @branches,
                    @status,
                    @business_unit,
                    @created_by
                )
                DECLARE @user_id INT = SCOPE_IDENTITY();

                SELECT
                    user_id,
                    user_name,
                    full_name,
                    email_address
                FROM users
                WHERE user_id = @user_id;
            `);
            
        return result.recordset[0];

    }

    async update(userId: number, payload: UpdateUserSchemaType): Promise<User> {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_id', sql.Int, userId)
            .input('full_name', sql.VarChar, payload.full_name)
            .input('description', sql.VarChar, payload.description)
            .input('position', sql.VarChar, payload.position)
            .input('email_address', sql.VarChar, payload.email_address)
            .input('mms', sql.VarChar, payload.mms)
            .input('env', sql.VarChar, payload.env)
            .input('branches', sql.VarChar, payload.branches)
            .input('status', sql.VarChar, payload.status)
            .input('business_unit', sql.VarChar, payload.business_unit)
            .input('last_update_by', sql.Int, payload.last_update_by)
            .query(`
            UPDATE users
                SET
                    full_name = @full_name,
                    description = @description,
                    position = @position,
                    email_address = @email_address,
                    mms = @mms,
                    env = @env,
                    branches = @branches,
                    status = @status,
                    business_unit = @business_unit,
                    last_update_by = @last_update_by
                WHERE user_id = @user_id;

                SELECT
                    user_id,
                    full_name,
                    description,
                    position,
                    email_address,
                    mms,
                    env,
                    branches,
                    status,
                    business_unit,
                    last_update_by
                FROM users
            WHERE user_id = @user_id;
        `);

        return result.recordset[0];
    }

    async delete(userId: number): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('user_id', sql.Int, userId)
            .query(`
                DELETE FROM users
                WHERE user_id = @user_id
            `);
    }

    async updatePassword(userId: number, hashedPassword: string, lastUpdateBy: number): Promise<void> {
        const db = await getDb();
        
        await db
            .request()
            .input('user_id', sql.Int, userId)
            .input('password', sql.VarChar, hashedPassword)
            .input('last_update_by', sql.Int, lastUpdateBy)
            .query(`
                UPDATE users
                SET password = @password,  last_update_by = @last_update_by
                WHERE user_id = @user_id
            `);
    }

    async history(userId: number) {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_id', sql.Int, userId)
            .query(`
               SELECT
                   *
                FROM users_history
                WHERE user_id = @user_id;
            `);

        return result.recordset ?? null;
    }

    async findByUsernames(usernames: string[]): Promise<string[]> {
        const db = await getDb();
        const request = db.request();

        const params = usernames.map((_, index) => `@username${index}`);

        usernames.forEach((username, index) => {
            request.input(
                `username${index}`,
                sql.VarChar(100),
                username
            );
        });

        const result = await request.query(`
            SELECT user_name
            FROM users
            WHERE user_name IN (${params.join(', ')})
        `);

        return result.recordset;
    }

    async bulkCreate(payload: BulkUserUploadSchemaType): Promise<void> {
        const db = await getDb();
        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);

            const values = payload.map((_, index) => {
                return `(
                    @user_name_${index},
                    @password_${index},
                    @full_name_${index},
                    @position_${index},
                    @email_address_${index},
                    @mms_${index},
                    @env_${index},
                    @branches_${index},
                    @status_${index},
                    @business_unit_${index},
                    @created_by_${index},
                    @description_${index}
                )`;
            });

            payload.forEach((user, index) => {
                request.input(`user_name_${index}`, sql.VarChar(100), user.user_name);
                request.input(`password_${index}`, sql.VarChar(255), user.password);
                request.input(`full_name_${index}`, sql.VarChar(255), user.full_name);
                request.input(`position_${index}`, sql.VarChar(255), user.position);
                request.input(`email_address_${index}`, sql.VarChar(255), user.email_address);
                request.input(`mms_${index}`, sql.VarChar(100), user.mms);
                request.input(`env_${index}`, sql.VarChar(100), user.env);
                request.input(`branches_${index}`, sql.VarChar(100), user.branches);
                request.input(`status_${index}`, sql.VarChar(50), user.status);
                request.input(`business_unit_${index}`, sql.VarChar(255), user.business_unit);
                request.input(`created_by_${index}`, sql.Int, user.created_by);
                request.input(`description_${index}`, sql.VarChar(sql.MAX), user.description ?? null); 
            });

            const result = await request.query(`
                INSERT INTO users (
                    user_name,
                    password,
                    full_name,
                    position,
                    email_address,
                    mms,
                    env,
                    branches,
                    status,
                    business_unit,
                    created_by,
                    description
                )
                VALUES ${values.join(', ')}
            `);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async csvExport({
        search,
        filterModel,
        sortModel,
    }: {
        search?: string;
        filterModel: UserFilter[];
        sortModel: any;
    }) {
        const db = await getDb();

        const conditions: string[] = [];

        const fields = {
            user_name: 'user_name',
            full_name: 'full_name',
            description: 'description',
            position: 'position',
            email_address: 'email_address',
            mms: 'mms',
            env: 'env',
            branches: 'branches',
            status: 'status',
            business_unit: 'business_unit',
        }

        const allowedFields: Record<string, string> = fields;

        const allowedSortFields: Record<string, string> = fields;

        // =========================
        // SEARCH INPUT
        // =========================

        if (search?.trim()) {
            conditions.push(`
                (
                    user_name LIKE @search
                    OR full_name LIKE @search
                )
            `);
        }

        // =========================
        // COLUMN FILTERS
        // =========================

        filterModel.forEach((filter, index) => {
            if (!filter.value) return;

            const column = allowedFields[filter.field];

            if (!column) return;

            const parameterName = `filterValue${index}`;

            conditions.push(`${column} LIKE @${parameterName}`);
        });

        // =========================
        // SORTING
        // =========================

        let orderBy = 'user_name ASC';

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

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // =========================
        // REQUEST
        // =========================

        const request = db.request();

        if (search?.trim()) {
            request.input(
                'search',
                sql.VarChar,
                `%${search.trim()}%`
            );
        }

        filterModel.forEach((filter, index) => {
            if (!filter.value) return;

            const column = allowedFields[filter.field];

            if (!column) return;

            const parameterName = `filterValue${index}`;

            request.input(
                parameterName,
                sql.VarChar,
                `%${filter.value}%`
            );
        });

        // =========================
        // NO PAGINATION HERE
        // =========================

        const result = await request.query<User>(`
            SELECT
                user_id,
                user_name,
                full_name,
                description,
                position,
                email_address,
                mms,
                env,
                branches,
                status,
                business_unit
            FROM users
            ${whereClause}
            ORDER BY ${orderBy}
        `);

        return result.recordset;
    }
    
}