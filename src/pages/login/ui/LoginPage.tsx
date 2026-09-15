// src/pages/login/ui/LoginPage.tsx
import { Link } from 'react-router-dom';
import {BrandMark} from "../../../shared/ui";
import {ROUTES} from "../../../shared/config/routes.ts";
import {LoginForm} from "../../../features/login";

export function LoginPage() {
    return (
        <div>
            {/* 1. 상단 서비스 브랜딩 */}
            <div>
                <BrandMark />
                <p>
                    입석·좌석 분할 예매 관리 서비스
                </p>
            </div>

            {/* 2. 핵심 로그인 기능 삽입 */}
            <LoginForm onSuccess={() => console.log("login success")} />

            {/* 3. 하단 네비게이션 링크 */}
            <div>
                <span>아직 계정이 없으신가요? </span>
                <Link to={ROUTES.SIGNUP}>
                    회원가입
                </Link>
            </div>
        </div>
    );
}