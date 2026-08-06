export interface PlsUpload {
    user_name: string, 
    env: string, 
    branch: number,
    page: number, 
    pageSize: number, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface PlsUploadStatus {
    user_name: string,
    env: string, 
    branch: number,
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface PlsUploadLogs {
    user_name: string, 
    env: string, 
    filename: string 
}

export interface PLsList {
    filename: string,
    uploaded_date: string
    uploaded_by: string,
    status: string,
    result: string,
}

export interface PlsCreate {
    filename: string,
    vendor_code: number,
    sales_invoice_no: string,
    branch_code: number,
    file_size: number,
    tran_type: number,
    env: string,
    uploaded_by: number,
    row_count: number,
    created_by: number,
    uploaded_attempts: number,
    status: number,
    tran_date: Date,
    result: string
    rows: any[],
    source_file_id: number,
    uploaded_date: Date,
}