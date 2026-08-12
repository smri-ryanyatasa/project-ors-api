export interface PlMasterfile {
    user_name: string, 
    env: string, 
    page: number, 
    pageSize: number, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface PlMasterfileStatus {
    user_name: string,
    env: string, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface ItemCsvExport {
    user_name: string, 
    env: string, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}

export interface ItemExcelExport {
    user_name: string, 
    env: string, 
    search: string | null, 
    sortColum: string, 
    sortOrder: string,
    filterModel: string | null, 
}