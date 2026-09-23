import sql from 'mssql';

import { getDb  } from '../../config/database';
import type { User, UserFilter, Branches, AssignebBranch } from './user.types';
import { type CreateUserSchemaType, type UpdateUserSchemaType, type BulkUserUploadSchemaType} from './user.schema';
import { withUserContext } from '../../lib/with-user-context';

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
    })  {
        const db = await getDb();

        const offset = (page - 1) * pageSize;

        const FIELDS = {
            user_name:      { inner: 'u.user_name', outer: 'p.user_name', },
            full_name:      { inner: 'u.full_name', outer: 'p.full_name', },
            email_address:  { inner: 'u.email_address', outer: 'p.email_address', },
            position:       { inner: 'u.position', outer: 'p.position', },
            status:         { inner: 'status', outer: 'p.status', },
            role_name:      { inner: 'r.name', outer: 'p.role_name', },
        }

        // SORTING DATAGRID
        const sort = sortModel?.[0];

        let innerOrderBy: string;
        let outerOrderBy: string;

        if (sort && FIELDS[sort.field as keyof typeof FIELDS]) {
            const sortColumn = FIELDS[sort.field as keyof typeof FIELDS];
            const direction = sort.sort === 'desc' ? 'DESC' : 'ASC';

            innerOrderBy = `
                ${sortColumn.inner} ${direction},
                u.user_id DESC
            `;

            outerOrderBy = `
                ${sortColumn.outer} ${direction},
                p.user_id DESC
            `;
        } else {
            innerOrderBy = `
                r.name ASC,
                u.full_name ASC,
                u.user_id DESC
            `;

            outerOrderBy = `
                p.role_name ASC,
                p.full_name ASC,
                p.user_id DESC
            `;
        }

        const request = db
        .request();

        const conditions: string[] = [];

        // SEARCH DATAGRID
        if (search?.trim()) {
            request.input(
                'search',
                sql.VarChar,
                `%${search.trim()}%`
            );

            conditions.push(`
                (
                    u.user_name LIKE @search
                    OR u.full_name LIKE @search
                    OR u.email_address LIKE @search
                    OR u.position LIKE @search
                    OR r.name LIKE @search
                )
            `);
        }

        const groupedConditions = new Map<string, string[]>();

        // MULTIPLE FILTER
        for (const [index, filter] of (filterModel ?? []).entries()) {
            const field = FIELDS[
                filter.field as keyof typeof FIELDS
            ];

            if (!field) {
                continue;
            }

            const value = filter.value?.trim();

            // These operators don't need a value
            const noValueOperator =
                filter.operator === 'isEmpty' ||
                filter.operator === 'isNotEmpty';

            if (!noValueOperator && !value) {
                continue;
            }

            const parameter = `filter${index}`;
            const column = field.inner;

            let condition;
            let parameterValue;

            switch (filter.operator) {
                case 'contains':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `%${value}%`;
                    break;

                case 'startsWith':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `${value}%`;
                    break;

                case 'endsWith':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `%${value}`;
                    break;

                case 'equals':
                    condition = `${column} = @${parameter}`;
                    parameterValue = value;
                    break;

                case 'doesNotEqual':
                    condition = `${column} <> @${parameter}`;
                    parameterValue = value;
                    break;

                case 'doesNotContain':
                    condition = `${column} NOT LIKE @${parameter}`;
                    parameterValue = `%${value}%`;
                    break;

                case 'isEmpty':
                    condition = `(${column} IS NULL OR LTRIM(RTRIM(${column})) = '')`;
                    break;

                case 'isNotEmpty':
                    condition = `(${column} IS NOT NULL AND LTRIM(RTRIM(${column})) <> '')`;
                    break;

                default:
                    continue;
            }
            request.input(
                parameter,
                sql.VarChar,
                parameterValue
            );

            const existing = groupedConditions.get(filter.field);

            if (existing) {
                existing.push(condition);
            } else {
                groupedConditions.set(filter.field, [condition]);
            }
        }

        for (const fieldConditions of groupedConditions.values()) {
            if (fieldConditions.length === 0) {
                continue;
            }

            conditions.push(
                fieldConditions.length === 1
                    ? fieldConditions[0]!
                    : `(${fieldConditions.join(' OR ')})`
            );
        }

        // WHERE CLAUSE
        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : '';

        // REQUEST INPUT
        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, pageSize);

        const query = `
            WITH PaginatedUsers AS (
                SELECT
                    u.user_id,
                    u.user_name,
                    u.full_name,
                    u.email_address,
                    u.position,
                    CASE
                        WHEN u.status = 'Y' THEN 'Active'
                        ELSE 'Inactive'
                    END AS status,
                    u.mms,
                    u.branches,
                    u.assigned_env,
                    ur.role_id,
                    r.name AS role_name,
                    COUNT(*) OVER() AS total_count
                FROM users u
                LEFT JOIN user_has_roles ur
                    ON ur.user_id = u.user_id
                LEFT JOIN roles r
                    ON r.id = ur.role_id

                ${whereClause}
                
                ORDER BY ${innerOrderBy}

                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY
            )

            SELECT
                p.user_id,
                p.user_name,
                p.full_name,
                p.email_address,
                p.position,
                p.status,
                p.mms,
                p.role_id,
                p.role_name,
                p.total_count,
                p.assigned_env,

                STRING_AGG(
                    CONCAT(b.branch_code, ' - ', b.branch_name),
                    ', '
                ) AS branches

            FROM PaginatedUsers p

            OUTER APPLY STRING_SPLIT(p.branches, ',') s

            LEFT JOIN branch b
                ON b.branch_code = TRIM(s.value)

            GROUP BY
                p.user_id,
                p.user_name,
                p.full_name,
                p.email_address,
                p.position,
                p.status,
                p.mms,
                p.role_id,
                p.role_name,
                p.total_count,
                p.assigned_env

            ORDER BY ${outerOrderBy};
        `;

        const result = await request.query(query);

        return {
            data: result.recordset,
            total: result.recordset[0]?.total_count ?? 0,
        }
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
                    assigned_env,
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
                    'SCP',
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
                    assigned_env = @env,
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
                    assigned_env,
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
                    @description_${index},
                    @assigned_env_${index}
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
                request.input(`assigned_env_${index}`, sql.VarChar(100), user.env);
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
                    description,
                    assigned_env
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

        const FIELDS = {
            user_name:      { inner: 'u.user_name', outer: 'p.user_name', },
            full_name:      { inner: 'u.full_name', outer: 'p.full_name', },
            email_address:  { inner: 'u.email_address', outer: 'p.email_address', },
            position:       { inner: 'u.position', outer: 'p.position', },
            status:         { inner: 'status', outer: 'p.status', },
            role_name:      { inner: 'r.name', outer: 'p.role_name', },
        }

        // SORTING DATAGRID
        const sort = sortModel?.[0];

        let innerOrderBy: string;

        if (sort && FIELDS[sort.field as keyof typeof FIELDS]) {
            const sortColumn = FIELDS[sort.field as keyof typeof FIELDS];
            const direction = sort.sort === 'desc' ? 'DESC' : 'ASC';

            innerOrderBy = `
                ${sortColumn.inner} ${direction},
                u.user_id DESC
            `;

        } else {
            innerOrderBy = `
                r.name ASC,
                u.full_name ASC,
                u.user_id DESC
            `;
        }

        const request = db
        .request();

        const conditions: string[] = [];

        // SEARCH DATAGRID
        if (search?.trim()) {
            request.input(
                'search',
                sql.VarChar,
                `%${search.trim()}%`
            );

            conditions.push(`
                (
                    u.user_name LIKE @search
                    OR u.full_name LIKE @search
                    OR u.email_address LIKE @search
                    OR u.position LIKE @search
                    OR r.name LIKE @search
                )
            `);
        }

        const groupedConditions = new Map<string, string[]>();

        // MULTIPLE FILTER
        for (const [index, filter] of (filterModel ?? []).entries()) {
            const field = FIELDS[
                filter.field as keyof typeof FIELDS
            ];

            if (!field) {
                continue;
            }

            const value = filter.value?.trim();

            // These operators don't need a value
            const noValueOperator =
                filter.operator === 'isEmpty' ||
                filter.operator === 'isNotEmpty';

            if (!noValueOperator && !value) {
                continue;
            }

            const parameter = `filter${index}`;
            const column = field.inner;

            let condition;
            let parameterValue;

            switch (filter.operator) {
                case 'contains':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `%${value}%`;
                    break;

                case 'startsWith':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `${value}%`;
                    break;

                case 'endsWith':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `%${value}`;
                    break;

                case 'equals':
                    condition = `${column} = @${parameter}`;
                    parameterValue = value;
                    break;

                case 'doesNotEqual':
                    condition = `${column} <> @${parameter}`;
                    parameterValue = value;
                    break;

                case 'doesNotContain':
                    condition = `${column} NOT LIKE @${parameter}`;
                    parameterValue = `%${value}%`;
                    break;

                case 'isEmpty':
                    condition = `(${column} IS NULL OR LTRIM(RTRIM(${column})) = '')`;
                    break;

                case 'isNotEmpty':
                    condition = `(${column} IS NOT NULL AND LTRIM(RTRIM(${column})) <> '')`;
                    break;

                default:
                    continue;
            }
            request.input(
                parameter,
                sql.VarChar,
                parameterValue
            );

            const existing = groupedConditions.get(filter.field);

            if (existing) {
                existing.push(condition);
            } else {
                groupedConditions.set(filter.field, [condition]);
            }
        }

        for (const fieldConditions of groupedConditions.values()) {
            if (fieldConditions.length === 0) {
                continue;
            }

            conditions.push(
                fieldConditions.length === 1
                    ? fieldConditions[0]!
                    : `(${fieldConditions.join(' OR ')})`
            );
        }

        // WHERE CLAUSE
        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : '';

        const query = `
            SELECT
                u.user_id,
                u.user_name,
                u.full_name,
                u.email_address,
                u.position,
                CASE
                    WHEN u.status = 'Y' THEN 'Active'
                    ELSE 'Inactive'
                END AS status,
                u.mms,
                u.branches,
                u.assigned_env as env,
                ur.role_id,
                r.name AS role_name,
                COUNT(*) OVER() AS total_count
            FROM users u
            LEFT JOIN user_has_roles ur
                ON ur.user_id = u.user_id
            LEFT JOIN roles r
                ON r.id = ur.role_id

            ${whereClause}
            
            ORDER BY ${innerOrderBy}
        `;

        const result = await request.query(query);

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

        const FIELDS = {
            user_name:      { inner: 'u.user_name', outer: 'p.user_name', },
            full_name:      { inner: 'u.full_name', outer: 'p.full_name', },
            email_address:  { inner: 'u.email_address', outer: 'p.email_address', },
            position:       { inner: 'u.position', outer: 'p.position', },
            status:         { inner: 'status', outer: 'p.status', },
            role_name:      { inner: 'r.name', outer: 'p.role_name', },
        }

        // SORTING DATAGRID
        const sort = sortModel?.[0];

        let innerOrderBy: string;

        if (sort && FIELDS[sort.field as keyof typeof FIELDS]) {
            const sortColumn = FIELDS[sort.field as keyof typeof FIELDS];
            const direction = sort.sort === 'desc' ? 'DESC' : 'ASC';

            innerOrderBy = `
                ${sortColumn.inner} ${direction},
                u.user_id DESC
            `;

        } else {
            innerOrderBy = `
                r.name ASC,
                u.full_name ASC,
                u.user_id DESC
            `;
        }

        const request = db
        .request();

        const conditions: string[] = [];

        // SEARCH DATAGRID
        if (search?.trim()) {
            request.input(
                'search',
                sql.VarChar,
                `%${search.trim()}%`
            );

            conditions.push(`
                (
                    u.user_name LIKE @search
                    OR u.full_name LIKE @search
                    OR u.email_address LIKE @search
                    OR u.position LIKE @search
                    OR r.name LIKE @search
                )
            `);
        }

        const groupedConditions = new Map<string, string[]>();

        // MULTIPLE FILTER
        for (const [index, filter] of (filterModel ?? []).entries()) {
            const field = FIELDS[
                filter.field as keyof typeof FIELDS
            ];

            if (!field) {
                continue;
            }

            const value = filter.value?.trim();

            // These operators don't need a value
            const noValueOperator =
                filter.operator === 'isEmpty' ||
                filter.operator === 'isNotEmpty';

            if (!noValueOperator && !value) {
                continue;
            }

            const parameter = `filter${index}`;
            const column = field.inner;

            let condition;
            let parameterValue;

            switch (filter.operator) {
                case 'contains':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `%${value}%`;
                    break;

                case 'startsWith':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `${value}%`;
                    break;

                case 'endsWith':
                    condition = `${column} LIKE @${parameter}`;
                    parameterValue = `%${value}`;
                    break;

                case 'equals':
                    condition = `${column} = @${parameter}`;
                    parameterValue = value;
                    break;

                case 'doesNotEqual':
                    condition = `${column} <> @${parameter}`;
                    parameterValue = value;
                    break;

                case 'doesNotContain':
                    condition = `${column} NOT LIKE @${parameter}`;
                    parameterValue = `%${value}%`;
                    break;

                case 'isEmpty':
                    condition = `(${column} IS NULL OR LTRIM(RTRIM(${column})) = '')`;
                    break;

                case 'isNotEmpty':
                    condition = `(${column} IS NOT NULL AND LTRIM(RTRIM(${column})) <> '')`;
                    break;

                default:
                    continue;
            }
            request.input(
                parameter,
                sql.VarChar,
                parameterValue
            );

            const existing = groupedConditions.get(filter.field);

            if (existing) {
                existing.push(condition);
            } else {
                groupedConditions.set(filter.field, [condition]);
            }
        }

        for (const fieldConditions of groupedConditions.values()) {
            if (fieldConditions.length === 0) {
                continue;
            }

            conditions.push(
                fieldConditions.length === 1
                    ? fieldConditions[0]!
                    : `(${fieldConditions.join(' OR ')})`
            );
        }

        // WHERE CLAUSE
        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(' AND ')}`
                : '';

        const query = `
            SELECT
                u.user_id,
                u.user_name,
                u.full_name,
                u.email_address,
                u.position,
                CASE
                    WHEN u.status = 'Y' THEN 'Active'
                    ELSE 'Inactive'
                END AS status,
                u.mms,
                u.branches,
                u.assigned_env as env,
                ur.role_id,
                r.name AS role_name,
                COUNT(*) OVER() AS total_count
            FROM users u
            LEFT JOIN user_has_roles ur
                ON ur.user_id = u.user_id
            LEFT JOIN roles r
                ON r.id = ur.role_id

            ${whereClause}
            
            ORDER BY ${innerOrderBy}
        `;

        const result = await request.query(query);

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

    async assignedBranch(user_name: string): Promise<AssignebBranch[]> {
        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('user_name', sql.VarChar, user_name)
                .query(`
                SELECT *
                FROM dbo.GetBranchListByUser('SCP', @user_name);
                `);
        });

        return result.recordset;
    } 

    async mmsusers(): Promise<Response[]> {
        const db = await getDb();

        const result = await db
            .request()
            .query(`
                SELECT m.*
                FROM mms_users AS m
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM users AS u
                    WHERE u.user_name = m.user_name
                );
            `);
        
        return result.recordset;
    } 
    
    async createMmsUser(payload: any[]): Promise<void> {
        const db = await getDb();
        const transaction = new sql.Transaction(db);

        try {
            await transaction.begin();

            const request = new sql.Request(transaction);

            const userValues = payload.map((_, index) => {
                return `(
                    @user_name_${index},
                    @password_${index},
                    @mms_${index},
                    @status_${index},
                    @created_by_${index}
                )`;
            });

            payload.forEach((user, index) => {
                request.input(`user_name_${index}`, sql.VarChar(100), user.user_name);
                request.input(`password_${index}`, sql.VarChar(255), user.password);
                request.input(`mms_${index}`, sql.VarChar(100), user.mms);
                request.input(`status_${index}`, sql.VarChar(50), 'Y');
                request.input(`created_by_${index}`, sql.Int, user.created_by);
            });

            await request.query(`
                DECLARE @InsertedUsers TABLE (
                    user_id INT,
                    user_name VARCHAR(100)
                );

                INSERT INTO users (
                    user_name,
                    password,
                    mms,
                    status,
                    created_by
                )
                OUTPUT
                    inserted.user_id,
                    inserted.user_name
                INTO @InsertedUsers (
                    user_id,
                    user_name
                )
                VALUES ${userValues.join(', ')};
             
                SELECT
                    iu.user_id
                FROM @InsertedUsers AS iu
            `);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}