import { MmsMasterfileRepository } from "./mmsMasterfile.repository";
import { type CreateBranchSchemaType, type CreateItemSchemaType } from "./mmsMasterfile.schema";
import type { InputParams, OutputResult } from './mmsMasterfile.type';

export class MmsMasterfileService {
     private repository = new MmsMasterfileRepository();

    async getMmsMasterfile({
        user_name,
        sourceTable,
        targetTable
    }: {
        user_name: string, 
        sourceTable: string,
        targetTable: string
    }) : Promise<OutputResult>{
        const response = await this.repository.mmsMasterfile({
            user_name, 
            sourceTable, 
            targetTable
        });

        return response;
    }

    async createBranch(payload: CreateBranchSchemaType) {

        const branch = await this.repository.createBranch({
            ...payload,
        });

        return {
            status: 'success',
            data: branch
        }
    }

    async createItem(payload: CreateItemSchemaType) {

        const item = await this.repository.createItem({
            ...payload,
        });

        return {
            status: 'success',
            data: item
        }
    }
}