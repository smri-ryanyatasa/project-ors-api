import { PlUploadRepository } from "./plUpload.repository";

export class PlUploadService {
     private repository = new PlUploadRepository();

    async getPlsUpload({
        user_name,
        env,
        branch,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: {
        user_name: string, 
        env: string, 
        branch: number,
        page: number, 
        pageSize: number, 
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
        const response = await this.repository.plsUpload({
            user_name, 
            env, 
            branch,
            page, 
            pageSize, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async getPlsUploadStatus({
        user_name, 
        env, 
        branch,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: {
        user_name: string, 
        env: string, 
        branch: number,
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
        const response = await this.repository.plsUploadStatus({
            user_name, 
            env, 
            branch,
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
        branch,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: {
        user_name: string, 
        env: string, 
        branch: number,
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
        const response = await this.repository.csvExport({
            user_name, 
            env, 
            branch,
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
        branch,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: {
        user_name: string, 
        env: string, 
        branch: number,
        search: string | null, 
        sortColum: string, 
        sortOrder: string,
        filterModel: string | null, 
    }) {
        const response = await this.repository.excelExport({
            user_name, 
            env, 
            branch,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async getPlUploadLogs({
        user_name, 
        env, 
        filename
    }: {
        user_name: string, 
        env: string, 
        filename: string
    }) {
        const response = await this.repository.plUploadLogs({
            user_name, 
            env,
            filename,
        });

        return response;
    }

    async getPlUploadExceptions({
        user_name, 
        env, 
        filename
    }: {
        user_name: string, 
        env: string, 
        filename: string
    }) {
        const response = await this.repository.plUploadExceptions({
            user_name, 
            env,
            filename,
        });

        return response;
    }

    async deletePl(id: number) {
        const existingFile = await this.repository.findPlById(id);

        if (!existingFile) {
            throw new Error('PL File not found.');
        }

        const file = await this.repository.deletePl(id);

        return {
            status: 'success',
            message: 'PL File successfully deleted.',
        }
    }

}