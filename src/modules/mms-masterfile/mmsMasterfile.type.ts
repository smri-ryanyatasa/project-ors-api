export interface InputParams {
    user_name: string,
    sourceTable: string,
    targetTable: string,
}

export interface OutputResult {
  status: string,
  statusMessage: string
}

export interface Branch {
    id: number,
    branch_code: string,
    branch_name: string,
    warehouse_code: string,
    warehouse_name: string,
    store_type: string,
    status: string,
    env: string,
}

export interface Item {
    id: number,
    style_code: string,
    style_name: string,
    sku_code: string,
    sku_name: string,
    upc: string,
    primary_vendor_code: string,
    primary_vendor_name: string,
    alt_vendor_code: string,
    alt_vendor_name: string,
    dept_code: string,
    dept_name: string,
    subdept_code: string,
    subdept_name: string,
    class_code: string,
    class_name: string,
    subclass_code: string,
    subclass_name: string,
    buying_uom: string,
    color: string,
    size_dimension: string,
    curr_regular_retail: string,
    status: string,
    env: string,
}
