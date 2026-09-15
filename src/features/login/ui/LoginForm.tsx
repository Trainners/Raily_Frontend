import {useState} from "react";
import {useDispatch} from "react-redux";
import {Button, Field, Note} from "../../../shared/ui";
import {setCredentials, useLoginMutation, type LoginRequest} from "../../../entities/user";
import styles from "./LoginForm.module.css"

// 입력할 필드별 에러 문구(에러가 없는 필드는 키가 없거나 undefined)
type LoginErrors = Partial<Record<keyof LoginRequest, string>>

export type LoginFormProps = {
    // 로그인 요청이 성공했을 때 호출
    onSuccess: () => void;
}

function validate(values: LoginRequest): LoginErrors {
    const errors: LoginErrors = {};

    if (!values.email.trim()) {
        errors.email = "이메일을 입력해주세요."
    }
    if (!values.password.trim()) {
        errors.password = "비밀번호를 입력해주세요."
    }
    return errors;
}

// 로그인 요청 실패 시 사용자에게 보여줄 문구
function getLoginErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null && "status" in err) {
        // 이메일, 비밀번호 불일치
        if (err.status === 401 || err.status === 403) {
            return "이메일 또는 비밀번호가 올바르지 않습니다.";
        }
        // 서버가 꺼져 있거나 네트워크 문제
        if (err.status === "FETCH_ERROR") {
            return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
        }
    }
    return "로그인 중 문제가 발생했습니다.";
}

export function LoginForm({onSuccess}: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginErrors>({});
    // 서버 요청 실패 문구 (필드별 입력 에러와는 별개)
    const [submitError, setSubmitError] = useState<string | null>(null);

    const dispatch = useDispatch();
    // login: 로그인 요청 함수, isLoading: 요청 진행 중 여부
    const [login, {isLoading}] = useLoginMutation();

    // 다시 입력을 시작한 필드의 에러만 지운다
    const handleEmailChange = (value: string) => {
        setEmail(value);
        setErrors((prev) => ({...prev, email: undefined}));
        setSubmitError(null);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setErrors((prev) => ({...prev, password: undefined}));
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 입력 검증
        const nextErrors = validate({email, password});
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitError(null);

        try {
            // 로그인 요청 (unwrap: 성공이면 응답 data 반환, 실패면 throw)
            const data = await login({email, password}).unwrap();
            // 토큰, 유저 정보 저장
            dispatch(setCredentials(data));
            // 페이지 이동은 LoginPage에 맡김
            onSuccess();
        } catch (err) {
            setSubmitError(getLoginErrorMessage(err));
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Field
                label="이메일"
                type="email"
                value={email}
                placeholder="example@email.com"
                error={errors.email}
                onChange={handleEmailChange}
            />
            <Field
                label="비밀번호"
                type="password"
                value={password}
                error={errors.password}
                onChange={handlePasswordChange}
            />
            {submitError && <Note tone="error">{submitError}</Note>}
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
            </Button>
        </form>
    );
}