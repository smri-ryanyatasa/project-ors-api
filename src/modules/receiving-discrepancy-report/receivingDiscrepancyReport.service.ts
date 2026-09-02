import { ReceivingDiscrepancyReportRepository } from "./receivingDiscrepancyReport.repository";

import type { ReceivingDiscrepancyReport, ReceivingDiscrepancyReportStatus, CsvExport, ExcelExport } from './receivingDiscrepancyReport.types';

export class ReceivingDiscrepancyReportService {
     private repository = new ReceivingDiscrepancyReportRepository();

    async getReceivingDiscrepancyReport({
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
    }: ReceivingDiscrepancyReport) {
        const response = await this.repository.receivingDiscrepancyReport({
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

    async getReceivingDiscrepancyReportStatus({
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
    }: ReceivingDiscrepancyReportStatus) {
        const response = await this.repository.receivingDiscrepancyReportStatus({
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
    }: CsvExport) {
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
    }: ExcelExport) {
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