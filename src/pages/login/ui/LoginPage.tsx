// src/pages/login/ui/LoginPage.tsx
import { Link } from 'react-router-dom';
import {BrandMark} from "../../../shared/ui";
import {LoginForm} from "../../../features/login/ui/LoginForm.tsx";
import {ROUTES} from "../../../shared/config/routes.ts";

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
            <LoginForm />

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