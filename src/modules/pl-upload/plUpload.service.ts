import { PlUploadRepository } from "./plUpload.repository";
import { UserRepository } from "../user/user.repository";
import type { PlsUpload, PlsUploadStatus, PlsUploadLogs, PLsList, PlsCreate } from './plUpload.types';

export class PlUploadService {
    private repository = new PlUploadRepository();
    private userRepository = new UserRepository();

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
    }: PlsUpload) {
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
    }: PlsUploadStatus) {
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
    }: PlsUploadStatus) {
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
    }: PlsUploadStatus) {
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
    }: PlsUploadLogs) {
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
    }: PlsUploadLogs) {
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

    async plUpload(payload: PlsCreate) {
        const assignedBranch = await this.userRepository.assignedBranch(payload.user_name);
        
        const existingBranch = assignedBranch.some((branch) => branch.branch_code === Number(payload.branch_code))

        if (!existingBranch) {
            throw new Error('You are no longer authorized to make changes on the selected Branch.');
        }
          
        const existingFile = await this.repository.findPlByFilename(payload.filename);

        if (existingFile) {
            throw new Error('PL File already exists.');
        }

        const result = await this.repository.plUpload(payload);
        
        return result;
    }

    async plReUpload(payload: PlsCreate) {
        const assignedBranch = await this.userRepository.assignedBranch(payload.user_name);
        
        const existingBranch = assignedBranch.some((branch) => branch.branch_code === Number(payload.branch_code))

        if (!existingBranch) {
            throw new Error('You are no longer authorized to make changes on the selected Branch.');
        }
        
        const existingFile = await this.repository.findPlByFilename(payload.filename);

        if (!existingFile) {
            throw new Error('PL File not found.');
        }

        const result = await this.repository.plReUpload(payload);

        return result;
    }

}