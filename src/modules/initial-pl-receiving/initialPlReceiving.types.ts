export interface InitialPlReceiving {
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

export interface InitialPlReceivingHasZero {
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

export interface InitialPlReceivingStatus {
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

export interface InitialPlReceivingCsvExport {
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

export interface InitialPlReceivingExcelExport {
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

export interface RowsUpdate {
    pl_id: string,
    actual_received: number,
    status: string,
    received_date: Date,
    received_by: string,
    source_file_id: string
}


