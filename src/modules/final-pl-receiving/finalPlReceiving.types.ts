export interface FinalPlReceiving {
    user_name: string, 
    env: string, 
    branch: number,
	filename: string,
	vendor_code: string,
	si_number: number,
    page: number, 
    pageSize: number, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface FinalPlReceivingStatus {
    user_name: string,
    env: string, 
    branch: number,
	filename: string,
	vendor_code: string,
	si_number: number,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface FinalPlReceivingCsvExport {
    user_name: string, 
    env: string, 
    branch: number,
    filename: string,
    vendor_code: string,
    si_number: number,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface FinalPlReceivingExcelExport {
    user_name: string, 
    env: string, 
    branch: number,
    filename: string,
    vendor_code: string,
    si_number: number,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface ToApprove {
    user_name: string, 
    env: string, 
    branch: number,
	filename: string,
	vendor_code: string,
	si_number: number,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
    status: string,
    last_update_by: number
}


