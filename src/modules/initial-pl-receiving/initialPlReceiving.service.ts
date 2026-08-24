import { InitialPlReceivingRepository } from "./initialPlReceiving.repository";

import type { InitialPlReceiving, InitialPlReceivingHasZero, InitialPlReceivingStatus, InitialPlReceivingCsvExport, InitialPlReceivingExcelExport, RowsUpdate } from './initialPlReceiving.types';

export class InitialPlReceivingService {
     private repository = new InitialPlReceivingRepository();

    async getInitialPlReceiving({
        user_name,
        env,
        branch,
        filename,
        vendor_code,
        si_number,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: InitialPlReceiving) {
        const response = await this.repository.initialPlReceiving({
            user_name, 
            env, 
            branch,
            filename,
            vendor_code,
            si_number,
            page, 
            pageSize, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async getInitialPlReceivingStatus({
        user_name, 
        env, 
        branch,
        filename,
        vendor_code,
        si_number,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: InitialPlReceivingStatus) {
        const response = await this.repository.initialPlReceivingStatus({
            user_name, 
            env, 
            branch,
            filename,
            vendor_code,
            si_number,
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
        filename,
        vendor_code,
        si_number,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: InitialPlReceivingCsvExport) {
        const response = await this.repository.csvExport({
            user_name, 
            env, 
            branch,
            filename,
            vendor_code,
            si_number,
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
        filename,
        vendor_code,
        si_number,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: InitialPlReceivingExcelExport) {
        const response = await this.repository.excelExport({
            user_name, 
            env, 
            branch,
            filename,
            vendor_code,
            si_number,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }
    
    async plFiles(branch_id: number) {
        const response = await this.repository.plFiles(branch_id);
        
        return response
    }

    async getPlsFiles({branchId, env, user_name}: {branchId: number, env: string, user_name: string}) {
        const response = await this.repository.getPlsFiles({branchId, env, user_name});

        return response;
    }

    async rowsUpdate(payload: RowsUpdate) {
        const response = await this.repository.rowsUpdate(payload);
        return response;
    }

    async getHasZero({
        user_name,
        env,
        branch,
        filename,
        vendor_code,
        si_number,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: InitialPlReceivingHasZero) {
        const response = await this.repository.hasZero({
            user_name,
            env,
            branch,
            filename,
            vendor_code,
            si_number,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async toConfirm(payload: any) {
        const response = await this.repository.toConfirm(payload);
        return response;
    }
}