import sql from 'mssql';

import { getDb  } from '../../config/database';
import { withUserContext } from '../../lib/with-user-context';

import type { InputParams, OutputResult, Branch, Item } from './mmsMasterfile.type';
import { type CreateBranchSchemaType, type CreateItemSchemaType} from './mmsMasterfile.schema';

export class MmsMasterfileRepository {
    async mmsMasterfile({
        user_name,
        sourceTable, 
        targetTable
    }: InputParams): Promise<OutputResult> {

        const result = await withUserContext(user_name, async (request) => {
            return request
                .input('sourceTable', sql.VarChar, sourceTable)
                .input('targetTable', sql.VarChar, targetTable)
                .output('status', sql.VarChar)
                .output('statusMessage', sql.VarChar)
                .output('logOutput', sql.VarChar)
                .output('totalRecordsMerged', sql.Int)
                .execute('DynamicMergeStagingToTarget');
        });
        
        return {
            status: result.output.status,
            statusMessage: result.output.statusMessage
        };
    }


    async findByBranchCode(branch_code: string): Promise<Branch | null> {
        const db = await getDb();

        const result = await db
            .request()
            .input('branch_code', sql.VarChar, branch_code)
            .query(`
                SELECT *
                FROM stg_branch
                WHERE branch_code = @branch_code
            `);

        return result.recordset[0] ?? null;
    }

    async createBranch(payload: CreateBranchSchemaType): Promise<Branch> {
        const db = await getDb();
        
        const result = await db
            .request()
            .input('branch_code', sql.VarChar, payload.branch_code)
            .input('branch_name', sql.VarChar, payload.branch_name)
            .input('warehouse_code', sql.VarChar, payload.warehouse_code)
            .input('warehouse_name', sql.VarChar, payload.warehouse_name)
            .input('store_type', sql.VarChar, payload.store_type)
            .input('status', sql.VarChar, payload.status)
            .input('env', sql.VarChar, payload.env)
            .query(`    
                    EXEC [dbo].[MergeMmsToStgBranch]
						@branch_code,
						@branch_name,
						@warehouse_code,
						@warehouse_name,
						@store_type,
						@status,
						@env;
            `);
            
        return result.recordset[0];

    }

    async createItem(payload: CreateItemSchemaType): Promise<Item> {
        const db = await getDb();

        const result = await db
            .request()
            .input('style_code', sql.VarChar, payload.style_code)
            .input('style_name', sql.VarChar, payload.style_name)
            .input('sku_code', sql.VarChar, payload.sku_code)
            .input('sku_name', sql.VarChar, payload.sku_name)
            .input('upc', sql.VarChar, payload.upc)
            .input('primary_vendor_code', sql.VarChar, payload.primary_vendor_code)
            .input('primary_vendor_name', sql.VarChar, payload.primary_vendor_name)
            .input('alt_vendor_code', sql.VarChar, payload.alt_vendor_code)
            .input('alt_vendor_name', sql.VarChar, payload.alt_vendor_name)
            .input('dept_code', sql.VarChar, payload.dept_code)
            .input('dept_name', sql.VarChar, payload.dept_name)
            .input('subdept_code', sql.VarChar, payload.subdept_code)
            .input('subdept_name', sql.VarChar, payload.subdept_name)
            .input('class_code', sql.VarChar, payload.class_code)
            .input('class_name', sql.VarChar, payload.class_name)
            .input('subclass_code', sql.VarChar, payload.subclass_code)
            .input('subclass_name', sql.VarChar, payload.subclass_name)
            .input('buying_uom', sql.VarChar, payload.buying_uom)
            .input('color', sql.VarChar, payload.color)
            .input('size_dimension', sql.VarChar, payload.size_dimension)
            .input('curr_regular_retail', sql.VarChar, payload.curr_regular_retail)
            .input('status', sql.VarChar, payload.status)
            .input('env', sql.VarChar, payload.env)
            .query(`    
                    EXEC [dbo].[MergeMmsToStgItem]
						@style_code,
						@style_name,
						@sku_code,
						@sku_name,
						@upc,
						@primary_vendor_code,
						@primary_vendor_name,
						@alt_vendor_code,
						@alt_vendor_name,
						@dept_code,
						@dept_name,
						@subdept_code,
						@subdept_name,
						@class_code,
						@class_name,
						@subclass_code,
						@subclass_name,
						@buying_uom,
						@color,
						@size_dimension,
						@curr_regular_retail,
						@status,
						@env;
            `);
            
        return result.recordset[0];

    }
}