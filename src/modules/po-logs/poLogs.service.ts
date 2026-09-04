import { PoLogsRepository } from "./poLogs.repository";

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
    }: {
        user_name: string, 
        env: string,
        page: number, 
        pageSize: number, 
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
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
    }: {
        user_name: string, 
        env: string,
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
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
    }: {
        user_name: string, 
        env: string,
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
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
    }: {
        user_name: string, 
        env: string,
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
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