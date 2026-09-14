import { Link } from "react-router-dom";

export default function LoginPage() {
    return (
        <>
            <h1>Raily</h1>
            <h2>앉아서 갈 수 있는 자리를 먼저 찾아드립니다.</h2>
            <br/>
            <p>이메일</p>
            <input type="text"/>
            <p>비밀번호</p>
            <input type="text"/>
            <button>로그인</button>
            <p>계정이 없으신가요?</p>
            <Link to='/sign-up'>회원가입</Link>
        </>
    )
}