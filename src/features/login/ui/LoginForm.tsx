import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../../shared/config/routes.ts";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 로그인 API 호출 및 인증 상태 갱신 로직
        navigate(ROUTES.JOURNEY_SETUP);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="코레일 회원번호"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">로그인</button>
        </form>
    );
}