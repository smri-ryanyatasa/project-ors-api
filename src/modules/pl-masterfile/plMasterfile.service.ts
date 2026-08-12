import { PlMasterfileRepository } from "./plMasterfile.repository";
import type { PlMasterfile, PlMasterfileStatus, ItemCsvExport, ItemExcelExport } from './plMasterfile.types';

export class PlMasterfileService {
    private repository = new PlMasterfileRepository();

    async getPlMasterfile({
        user_name,
        env,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlMasterfile) {
        const response = await this.repository.plMasterfile({
            user_name, 
            env, 
            page, 
            pageSize, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async getPlMasterfileStatus({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlMasterfileStatus) {
        const response = await this.repository.plMasterfileStatus({
            user_name, 
            env, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async csvExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ItemCsvExport) {
        const response = await this.repository.csvExport({
            user_name, 
            env, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async excelExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ItemExcelExport) {
        const response = await this.repository.excelExport({
            user_name, 
            env, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

}