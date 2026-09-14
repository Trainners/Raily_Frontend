export type User = {
    id: number;
    email: string;
    nickname: string;
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}