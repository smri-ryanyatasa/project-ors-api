import { FinalPlReceivingRepository } from "./finalPlReceiving.repository";
import type { FinalPlReceiving, FinalPlReceivingStatus, FinalPlReceivingCsvExport, FinalPlReceivingExcelExport, ToApprove } from './finalPlReceiving.types';

export class FinalPlReceivingService {
     private repository = new FinalPlReceivingRepository();

    async getFinalPlReceiving({
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
    }: FinalPlReceiving) {
        const response = await this.repository.finalPlReceiving({
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

    async getFinalPlReceivingStatus({
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
    }: FinalPlReceivingStatus) {
        const response = await this.repository.finalPlReceivingStatus({
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
    }: FinalPlReceivingCsvExport) {
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
    }: FinalPlReceivingExcelExport) {
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

    async rowsUpdate(payload: any) {
        const check = await this.repository.checkIfAlreadyApprovedReceipt(payload.rows);

        if (!check) {
            throw new Error('Some items have already been submitted and cannot be edited. Please refresh the list.');
        }

        const response = await this.repository.rowsUpdate(payload);

        return response;
    }
    
    async toApproved({ 
        user_name,
        env,
        branch,
        filename,
        vendor_code,
        si_number,
        search, 
        sortColum, 
        sortOrder,
        filterModel,
        status,
        last_update_by
    }: ToApprove) {
        const response = await this.repository.toApproved({
            user_name,
            env,
            branch,
            filename,
            vendor_code,
            si_number,
            search, 
            sortColum, 
            sortOrder,
            filterModel,
            status,
            last_update_by
        });

        const action = await this.repository.approvedUpdate(response, status, last_update_by);

        return action;
    }



}