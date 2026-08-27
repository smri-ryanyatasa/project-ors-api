import { PlAgingReportRepository } from "./plAgingReport.repository";
import type { PlAgingReport, PlAgingReportStatus } from './plAgingReport.types';

export class PlAgingReportService {
     private repository = new PlAgingReportRepository();

    async getPlAgingReport({
        user_name,
        env,
	    uploadedStartDate,
	    uploadedEndDate,
	    initialStartDate,
	    initialEndDate,
	    approveReceiptStartDate,
	    approveReceiptEndDate,
	    poGeneratedStartDate,
	    poGeneratedEndDate,
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlAgingReport) {
        const response = await this.repository.plAgingReport({
            user_name, 
            env, 
	        uploadedStartDate,
	        uploadedEndDate,
	        initialStartDate,
	        initialEndDate,
	        approveReceiptStartDate,
	        approveReceiptEndDate,
	        poGeneratedStartDate,
	        poGeneratedEndDate,
            page, 
            pageSize, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async getPlAgingReportStatus({
        user_name, 
        env, 
	    uploadedStartDate,
	    uploadedEndDate,
	    initialStartDate,
	    initialEndDate,
	    approveReceiptStartDate,
	    approveReceiptEndDate,
	    poGeneratedStartDate,
	    poGeneratedEndDate,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlAgingReportStatus) {
        const response = await this.repository.plAgingReportStatus({
            user_name, 
            env, 
	        uploadedStartDate,
	        uploadedEndDate,
	        initialStartDate,
	        initialEndDate,
	        approveReceiptStartDate,
	        approveReceiptEndDate,
	        poGeneratedStartDate,
	        poGeneratedEndDate,
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
	    uploadedStartDate,
	    uploadedEndDate,
	    initialStartDate,
	    initialEndDate,
	    approveReceiptStartDate,
	    approveReceiptEndDate,
	    poGeneratedStartDate,
	    poGeneratedEndDate,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlAgingReportStatus) {
        const response = await this.repository.csvExport({
            user_name, 
            env, 
            uploadedStartDate,
            uploadedEndDate,
            initialStartDate,
            initialEndDate,
            approveReceiptStartDate,
            approveReceiptEndDate, 
            poGeneratedStartDate,
            poGeneratedEndDate,
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
        uploadedStartDate,
        uploadedEndDate,
        initialStartDate,
        initialEndDate,
        approveReceiptStartDate,
        approveReceiptEndDate,
        poGeneratedStartDate,
        poGeneratedEndDate,
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: PlAgingReportStatus) {
        const response = await this.repository.excelExport({
            user_name, 
            env, 
            uploadedStartDate,
            uploadedEndDate,
            initialStartDate,
            initialEndDate,
            approveReceiptStartDate,
            approveReceiptEndDate, 
            poGeneratedStartDate,
            poGeneratedEndDate,
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

}