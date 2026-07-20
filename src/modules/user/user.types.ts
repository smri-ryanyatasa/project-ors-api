export interface User {
    user_id: number,
    user_name: string,
    full_name: string,
    description: string,
    position: string,
    email_address: string,
    mms: string,
    env: string,
    branches: string,
    status: string,
    business_unit: string,
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserFilter {
    field: string;
    operator: string;
    value?: string;
};