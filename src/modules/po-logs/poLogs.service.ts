import { PoLogsRepository } from "./poLogs.repository";

import type { PoLogs, PoLogsStatus } from './poLogs.types';

export class PoLogsService {
     private repository = new PoLogsRepository();

    async getPoLogs({
        user_name,
        env,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PoLogs) {
        const response = await this.repository.poLogs({
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

    async getPoLogsStatus({
        user_name, 
        env,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PoLogsStatus) {
        const response = await this.repository.poLogsStatus({
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
    }: PoLogsStatus) {
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
    }: PoLogsStatus) {
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