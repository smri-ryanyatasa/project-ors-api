import sql from 'mssql';

import { getDb  } from '../../config/database';
import type { UserWithPassword } from '../user/user.types';

export class AuthRepository {
    async findByUsername(userName: string): Promise<UserWithPassword | null> {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_name', sql.VarChar, userName)
            .query(`
                SELECT
                    user_id,
                    user_name,
                    password
                FROM users
                WHERE user_name = @user_name
            `);

        return result.recordset[0];
    }

    
    async updatePassword(userId: number, hashedPassword: string): Promise<void> {
        const db = await getDb();

        await db
            .request()
            .input('user_id', sql.Int, userId)
            .input('password', sql.VarChar, hashedPassword)
            .query(`
                UPDATE users
                SET password = @password
                WHERE user_id = @user_id
            `);
    }

    async findPasswordById(userId: number): Promise<string | null> {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT password
                FROM users
                WHERE user_id = @user_id
            `);

        return result.recordset[0]?.password ?? null;
    }

    async findUserById(userId: number) {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT
                    user_id,
                    user_name,
                    full_name,
                    email_address,
                    position
                FROM users
                WHERE user_id = @user_id
            `);

        return result.recordset[0] ?? null;
    }
}