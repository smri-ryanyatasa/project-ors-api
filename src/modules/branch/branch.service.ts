import { BranchRepository } from "./branch.repository"
import type { Branch, BranchCsvExport } from './branch.types';

export class BranchService {
    private repository = new BranchRepository();

    async getBranches({
        user_name, 
        env, 
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: Branch) {
        const response = this.repository.branches({
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

    async csvExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: BranchCsvExport) {
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
    }: BranchCsvExport) {
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