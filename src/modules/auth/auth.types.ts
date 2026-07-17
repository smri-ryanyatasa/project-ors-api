export interface AuthUser {
    user_id: number;
    user_name: string;
    full_name: string;
    email_address: string;
}

export interface LoginResponse {
    access_token: string;
    user: AuthUser;
}