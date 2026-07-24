import sql from 'mssql';

import { getDb  } from '../../config/database';
import type { User, UserFilter, Branches } from './user.types';
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
            user_name: 'u.user_name',
            full_name: 'u.full_name',
            description: 'u.description',
            position: 'u.position',
            email_address: 'u.email_address',
            mms: 'u.mms',
            env: 'u.env',
            branches: 'u.branches',
            status: 'u.status',
            business_unit: 'u.business_unit',
            role_name: 'r.name',
        }

        const allowedFields: Record<string, string> = fields

        const allowedSortFields: Record<string, string> = fields

        // ======================================
        // SEARCH INPUT / QUICK FILTER
        // ======================================
        if (search?.trim()) {
            conditions.push(`
                (
                    u.user_name LIKE @search
                    OR u.full_name LIKE @search
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
        filterModel.forEach((filter, index) => {
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
                `%${search.trim()}%`
            );
        }

        // ======================================
        // SORTING QUERY
        // ======================================
        let orderBy = 'u.user_name ASC';

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

        // // Column filter parameters
        // filterModel.forEach((filter, index) => {
        //     if (!filter.value) return;

        //     const column = allowedFields[filter.field];

        //     if (!column) return;

        //     const parameterName = `filterValue${index}`;

        //     request.input(
        //         parameterName,
        //         sql.VarChar,
        //         `%${filter.value}%`
        //     );
        // });

        const usersResult = await request.query<User>(`
            SELECT
                u.user_id,
                u.user_name,
                u.full_name,
                u.description,
                u.position,
                u.email_address,
                u.mms,
                u.env,
                u.branches,
                u.status,
                u.business_unit,
                r.name AS role_name,
                r.id as role_id
            FROM users as u
            LEFT JOIN user_has_roles as uhr
                ON uhr.user_id = u.user_id
            LEFT JOIN roles as r
                ON r.id = uhr.role_id
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
            FROM users AS u
            LEFT JOIN user_has_roles AS uhr
                ON uhr.user_id = u.user_id
            LEFT JOIN roles AS r
                ON r.id = uhr.role_id
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

    async createUserHasRole(user_id: number, payload: CreateUserSchemaType): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('user_id', sql.Int, user_id)
            .input('role_id', sql.Int, payload.role_id)
            .query(`
                INSERT INTO user_has_roles
                (
                    user_id,
                    role_id
                )
                VALUES
                (
                    @user_id,
                    @role_id
                )
            `)
    }

    async updateUserHasRole(user_id: number, role_id: number): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('user_id', sql.Int, user_id)
            .input('role_id', sql.Int, role_id)
            .query(`
                IF EXISTS (
                    SELECT 1
                    FROM user_has_roles
                    WHERE user_id = @user_id
                )
                BEGIN
                    UPDATE user_has_roles
                    SET role_id = @role_id
                    WHERE user_id = @user_id;
                END
                ELSE
                BEGIN
                    INSERT INTO user_has_roles (
                        user_id,
                        role_id
                    )
                    VALUES (
                        @user_id,
                        @role_id
                    );
                END
            `)
    }

    async deleteUserHasRole(user_id: number): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('user_id', sql.Int, user_id)
            .query(`
                DELETE FROM user_has_roles
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

    // async bulkCreate(payload: BulkUserUploadSchemaType): Promise<void> {
    //     const db = await getDb();
    //     const transaction = new sql.Transaction(db);

    //     try {
    //         await transaction.begin();

    //         const request = new sql.Request(transaction);

    //         const values = payload.map((_, index) => {
    //             return `(
    //                 @user_name_${index},
    //                 @password_${index},
    //                 @full_name_${index},
    //                 @position_${index},
    //                 @email_address_${index},
    //                 @mms_${index},
    //                 @env_${index},
    //                 @branches_${index}, 
    //                 @status_${index},
    //                 @business_unit_${index},
    //                 @created_by_${index},
    //                 @description_${index}
    //             )`;
    //         });

    //         payload.forEach((user, index) => {
    //             request.input(`user_name_${index}`, sql.VarChar(100), user.user_name);
    //             request.input(`password_${index}`, sql.VarChar(255), user.password);
    //             request.input(`full_name_${index}`, sql.VarChar(255), user.full_name);
    //             request.input(`position_${index}`, sql.VarChar(255), user.position);
    //             request.input(`email_address_${index}`, sql.VarChar(255), user.email_address);
    //             request.input(`mms_${index}`, sql.VarChar(100), user.mms);
    //             request.input(`env_${index}`, sql.VarChar(100), user.env);
    //             request.input(`branches_${index}`, sql.VarChar(100), user.branches);
    //             request.input(`status_${index}`, sql.VarChar(50), user.status);
    //             request.input(`business_unit_${index}`, sql.VarChar(255), user.business_unit);
    //             request.input(`created_by_${index}`, sql.Int, user.created_by);
    //             request.input(`description_${index}`, sql.VarChar(sql.MAX), user.description ?? null); 
    //         });

    //         const result = await request.query(`
    //             INSERT INTO users (
    //                 user_name,
    //                 password,
    //                 full_name,
    //                 position,
    //                 email_address,
    //                 mms,
    //                 env,
    //                 branches,
    //                 status,
    //                 business_unit,
    //                 created_by,
    //                 description
    //             )
    //             VALUES ${values.join(', ')}
    //         `);

    //         await transaction.commit();

    //     } catch (error) {
    //         await transaction.rollback();
    //         throw error;
    //     }
    // }

    async bulkCreate(payload: BulkUserUploadSchemaType): Promise<void> {
        const db = await getDb();
        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);

            const userValues = payload.map((_, index) => {
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

            const roleValues = payload.map((_, index) => {
                return `(
                    @user_name_${index},
                    @role_${index}
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
                request.input(`role_${index}`, sql.VarChar(255), user.role);
            });

            // -- Validate roles first
            // IF EXISTS (
            //     SELECT 1
            //     FROM @RoleAssignments AS ra
            //     LEFT JOIN roles AS r
            //         ON r.name = ra.role_name
            //     WHERE r.id IS NULL
            // )
            // BEGIN
            //     THROW 50001, 'One or more roles do not exist.', 1;
            // END;

            await request.query(`
                DECLARE @RoleAssignments TABLE (
                    user_name VARCHAR(100),
                    role_name VARCHAR(255)
                );

                INSERT INTO @RoleAssignments (
                    user_name,
                    role_name
                )
                VALUES ${roleValues.join(', ')};

                DECLARE @InsertedUsers TABLE (
                    user_id INT,
                    user_name VARCHAR(100)
                );

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
                OUTPUT
                    inserted.user_id,
                    inserted.user_name
                INTO @InsertedUsers (
                    user_id,
                    user_name
                )
                VALUES ${userValues.join(', ')};


                INSERT INTO user_has_roles (
                    user_id,
                    role_id
                )
                SELECT
                    iu.user_id,
                    r.id
                FROM @InsertedUsers AS iu
                INNER JOIN @RoleAssignments AS ra
                    ON ra.user_name = iu.user_name
                INNER JOIN roles AS r
                    ON r.name = ra.role_name;
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
            user_name: 'u.user_name',
            full_name: 'u.full_name',
            description: 'u.description',
            position: 'u.position',
            email_address: 'u.email_address',
            mms: 'u.mms',
            env: 'u.env',
            branches: 'u.branches',
            status: 'u.status',
            business_unit: 'u.business_unit',
            role_name: 'r.name',
        }

        const allowedFields: Record<string, string> = fields;

        const allowedSortFields: Record<string, string> = fields;

        // =========================
        // SEARCH INPUT
        // =========================

        if (search?.trim()) {
            conditions.push(`
                (
                    u.user_name LIKE @search
                    OR u.full_name LIKE @search
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

        let orderBy = 'u.user_name ASC';

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
                u.user_id,
                u.user_name,
                u.full_name,
                u.description,
                u.position,
                u.email_address,
                u.mms,
                u.env,
                u.branches,
                u.status,
                u.business_unit,
                r.name AS role_name,
                r.id as role_id
            FROM users as u
            LEFT JOIN user_has_roles as uhr
                ON uhr.user_id = u.user_id
            LEFT JOIN roles as r
                ON r.id = uhr.role_id
            ${whereClause}
            ORDER BY ${orderBy}
        `);
        
        return result.recordset;
    }

    async excelExport({
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
            user_name: 'u.user_name',
            full_name: 'u.full_name',
            description: 'u.description',
            position: 'u.position',
            email_address: 'u.email_address',
            mms: 'u.mms',
            env: 'u.env',
            branches: 'u.branches',
            status: 'u.status',
            business_unit: 'u.business_unit',
            role_name: 'r.name',
        }

        const allowedFields: Record<string, string> = fields;

        const allowedSortFields: Record<string, string> = fields;

        // =========================
        // SEARCH INPUT
        // =========================

        if (search?.trim()) {
            conditions.push(`
                (
                    u.user_name LIKE @search
                    OR u.full_name LIKE @search
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

        let orderBy = 'u.user_name ASC';

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
                u.user_id,
                u.user_name,
                u.full_name,
                u.description,
                u.position,
                u.email_address,
                u.mms,
                u.env,
                u.branches,
                u.status,
                u.business_unit,
                r.name AS role_name,
                r.id as role_id
            FROM users as u
            LEFT JOIN user_has_roles as uhr
                ON uhr.user_id = u.user_id
            LEFT JOIN roles as r
                ON r.id = uhr.role_id
            ${whereClause}
            ORDER BY ${orderBy}
        `);

        return result.recordset;
    }

    async getBranches(): Promise<Branches[]> {
        const db = await getDb();

        const result = await db
            .request()
            .query(`
                SELECT 
                    branch_code,
                    branch_name,
                    warehouse_code,
                    warehouse_name,
                    store_type,
                    status,
                    env
                FROM branch
                WHERE branch_name != 'CLOSED'
            `);
        
        return result.recordset;
    }
    
}