import sql from 'mssql';

import { getDb  } from '../../config/database';
import type { User } from './user.types';
import { type CreateUserSchemaType, type UpdateUserSchemaType } from './user.schema';

export class UserRepository {
    async findAll(): Promise<User[]> {
        const db = await getDb();

        const users = await db.request().query(`
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
            ORDER BY user_name
        `);

        return users.recordset;

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
}