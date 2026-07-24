export interface User {
    user_id: number,
    user_name: string,
    full_name: string,
    role_name: string;
    description: string,
    position: string,
    email_address: string,
    mms: string,
    env: string,
    branches: string,
    status: string,
    business_unit: string,
    role_id: number
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserFilter {
    field: string;
    operator: string;
    value?: string;
};

export interface Branches {
    branch_code: number;
    branch_name: string;
    warehouse_code: number;
    warehouse_name: string;
    store_type: string;
    status: string;
    env: string;
}