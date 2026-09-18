import sql from 'mssql';

import { getDb  } from '../../config/database';

import type { Update } from './receiving_approval.types';

export class ReceivingApprovalRepository {

    async getStores() {
        const db = await getDb();

        const result = await db
            .request()
            .query(`
                SELECT 
                    *
                FROM ors_pl_receiving_approval
            `);
        
        return result.recordset;
    }

    async updateStore(payload: Update): Promise<number> {
        const db = await getDb();

        const result = await db
            .request()
            .input('store_type', sql.VarChar, payload.type)
            .input('is_enable', sql.VarChar, payload.isEnable)
            .query(`
                UPDATE ors_pl_receiving_approval 
                SET 
                    enable_store = @is_enable
                WHERE store_type = @store_type
            `)
        
        return result.rowsAffected[0] ?? 0;
}

}
