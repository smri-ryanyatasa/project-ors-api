export interface ReceivingDiscrepancyReport {
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

export interface ReceivingDiscrepancyReportStatus {
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

export interface CsvExport {
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

export interface ExcelExport {
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
