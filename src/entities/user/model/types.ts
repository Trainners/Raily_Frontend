// 앱 내부에서 쓰는 로그인 유저 정보
export type User = {
    email: string;
    name: string;
};

export interface LoginRequest {
    email: string;
    password: string;
}

// 백엔드 /api/auth/login 응답 (백엔드 LoginResponse.java와 1:1로 맞춤)
export interface LoginResponse {
    accessToken: string;
    email: string;
    name: string;
}