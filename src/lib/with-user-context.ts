// with-user-context.ts

import sql from 'mssql';
import { getDb } from '../config/database';

export async function withUserContext<T>(
  username: string,
  callback: (request: sql.Request) => Promise<T>
): Promise<T> {
  const db = await getDb();

  const transaction = new sql.Transaction(db);

  await transaction.begin();

  try {
    const contextRequest = new sql.Request(transaction);

    await contextRequest
      .input('ContextKey', sql.NVarChar, 'WebPageUser')
      .input('ContextValue', sql.NVarChar, username)
      .input('IsReadOnly', sql.Bit, 0)
      .query(`
        EXEC dbo.SetMySessionContext
          @ContextKey = @ContextKey,
          @ContextValue = @IsReadOnly
      `);

    const request = new sql.Request(transaction);

    const result = await callback(request);

    await transaction.commit();

    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}