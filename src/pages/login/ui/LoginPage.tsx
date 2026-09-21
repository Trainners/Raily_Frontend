import {Link, useLocation, useNavigate} from 'react-router-dom';
import {BrandMark} from "../../../shared/ui";
import {ROUTES} from "../../../shared/config/routes.ts";
import {LoginForm} from "../../../features/login";
import {resolvePostLoginPath} from "../../../shared/lib/safePath.ts";

export default function LoginPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginSuccess = () => {
        // RedirectIfAuthenticated 와 같은 함수로 계산해야 어느 쪽이 먼저 실행돼도 결과가 같다
        navigate(resolvePostLoginPath(location.state, ROUTES.JOURNEY_SETUP), {replace: true})
    }

    return (
        <div>
            {/* 상단 서비스 브랜드 마크 */}
            <div>
                <BrandMark/>
                <p>
                    자유석 빈자리 찾기 서비스
                </p>
            </div>

            {/* 핵심 로그인 기능 */}
            <LoginForm onSuccess={handleLoginSuccess}/>

            {/* 하단 네비게이션 링크 */}
            <div>
                <span>아직 계정이 없으신가요? </span>
                <Link to={ROUTES.SIGNUP}>
                    회원가입
                </Link>
            </div>
        </div>
    );
}