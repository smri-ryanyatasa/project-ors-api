import { ReceivingReportRepository } from "./receivingReport.repository";
import type { ReceivingReport, ReceivingReportStatus, ReceivingReportCsvExport, ReceivingReportExcelExport } from './receivingReport.types';

export class ReceivingReportService {
     private repository = new ReceivingReportRepository();

    async getReceivingReport({
        user_name,
        env,
        branch,
        initialReceiptStartDate,
        initialReceiptEndDate,
        finalReceiptStartDate,
        finalReceiptEndDate,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ReceivingReport) {
        const response = await this.repository.receivingReport({
            user_name, 
            env, 
            branch,
            initialReceiptStartDate,
            initialReceiptEndDate,
            finalReceiptStartDate,
            finalReceiptEndDate,
            page, 
            pageSize, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async getReceivingReportStatus({
        user_name, 
        env, 
        branch,
        initialReceiptStartDate,
        initialReceiptEndDate,
        finalReceiptStartDate,
        finalReceiptEndDate,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ReceivingReportStatus) {
        const response = await this.repository.receivingReportStatus({
            user_name, 
            env, 
            branch,
            initialReceiptStartDate,
            initialReceiptEndDate,
            finalReceiptStartDate,
            finalReceiptEndDate,
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
        initialReceiptStartDate,
        initialReceiptEndDate,
        finalReceiptStartDate,
        finalReceiptEndDate,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ReceivingReportCsvExport) {
        const response = await this.repository.csvExport({
            user_name, 
            env, 
            branch,
            initialReceiptStartDate,
            initialReceiptEndDate,
            finalReceiptStartDate,
            finalReceiptEndDate,
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
        initialReceiptStartDate,
        initialReceiptEndDate,
        finalReceiptStartDate,
        finalReceiptEndDate,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ReceivingReportExcelExport) {
        const response = await this.repository.excelExport({
            user_name, 
            env, 
            branch,
            initialReceiptStartDate,
            initialReceiptEndDate,
            finalReceiptStartDate,
            finalReceiptEndDate,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

}