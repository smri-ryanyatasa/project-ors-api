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