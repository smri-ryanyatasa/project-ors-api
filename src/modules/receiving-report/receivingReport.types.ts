export interface ReceivingReport {
    user_name: string, 
    env: string, 
    branch: number,
	initialReceiptStartDate: string,
	initialReceiptEndDate: string,
	finalReceiptStartDate: string,
	finalReceiptEndDate: string,
    page: number, 
    pageSize: number, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface ReceivingReportStatus {
    user_name: string,
    env: string, 
    branch: number,
	initialReceiptStartDate: string,
	initialReceiptEndDate: string,
	finalReceiptStartDate: string,
	finalReceiptEndDate: string,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface ReceivingReportCsvExport {
    user_name: string,
    env: string, 
    branch: number,
	initialReceiptStartDate: string,
	initialReceiptEndDate: string,
	finalReceiptStartDate: string,
	finalReceiptEndDate: string,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface ReceivingReportExcelExport {
    user_name: string,
    env: string, 
    branch: number,
	initialReceiptStartDate: string,
	initialReceiptEndDate: string,
	finalReceiptStartDate: string,
	finalReceiptEndDate: string,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}
