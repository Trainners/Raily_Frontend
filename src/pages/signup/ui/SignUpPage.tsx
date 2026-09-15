import {Link, useNavigate} from "react-router-dom";
import {ROUTES} from "../../../shared/config/routes.ts";
import {SignupForm} from "../../../features/signup";

export default function SignUpPage() {
    const navigate = useNavigate();

    const handleSignupSuccess = () => {
        // 가입 폼으로 뒤로가기 되지 않도록 현재 기록을 교체
        navigate(ROUTES.LOGIN, {replace: true});
    };

    return (
        <div>
            {/* 상단 안내 문구 */}
            <div>
                <h1>서비스 계정 만들기</h1>
                <p>Raily 서비스를 사용하기 위한 가입 과정입니다.</p>
            </div>

            {/* 회원가입 폼 */}
            <SignupForm onSuccess={handleSignupSuccess}/>

            {/* 하단 네비게이션 링크 */}
            <div>
                <span>이미 계정이 있으신가요? </span>
                <Link to={ROUTES.LOGIN}>로그인</Link>
            </div>
        </div>
    );
}