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
                    u.user_id,
                    u.user_name,
                    u.full_name,
                    u.email_address,
                    u.position,
                    u.env,
                    r.id AS role_id,
                    r.name AS role_name,

                    JSON_QUERY((
                        SELECT
                            m.id,
                            m.name,
                            m.parent_id,
                            m.menu_sequence,
                            m.url,
                            m.icon
                        FROM role_menus AS rm
                        JOIN menus AS m
                            ON m.id = rm.menu_id
                        WHERE rm.role_id = r.id
                        FOR JSON PATH
                    )) AS menus

                FROM users AS u

                JOIN user_has_roles AS uhr
                    ON uhr.user_id = u.user_id

                JOIN roles AS r
                    ON r.id = uhr.role_id

                WHERE u.user_id = @user_id;
            `);

        return result.recordset[0] ?? null;
    }

    async getAssignedMenus(userId: number) {
        const db = await getDb();

        const result = await db
            .request()
            .input('user_id', sql.Int, userId)
            .query(`
               SELECT
                    JSON_QUERY((
                        SELECT
                            m.id,
                            m.name,
                            m.parent_id,
                            m.menu_sequence,
                            m.url,
                            m.icon
                        FROM role_menus AS rm
                        JOIN menus AS m
                            ON m.id = rm.menu_id
                        WHERE rm.role_id = r.id
                        FOR JSON PATH
                    )) AS menus

                FROM users AS u

                JOIN user_has_roles AS uhr
                    ON uhr.user_id = u.user_id

                JOIN roles AS r
                    ON r.id = uhr.role_id

                WHERE u.user_id = @user_id;
            `);

        return result.recordset[0];
    }
}