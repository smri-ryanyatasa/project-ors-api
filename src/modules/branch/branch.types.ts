export interface Branch {
    user_name: string, 
    env: string, 
    page: number, 
    pageSize: number, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface BranchCsvExport {
    user_name: string, 
    env: string, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}