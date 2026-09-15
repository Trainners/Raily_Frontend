import {useState} from "react";
import {type SignUpRequest, useSignupMutation} from "../../../entities/user";
import {Button, Field, Note} from "../../../shared/ui";

type SignupValues = SignUpRequest & {
    passwordConfirm: string;
}

type SignupErrors = Partial<Record<keyof SignupValues, string>>

export type SignupFormProps = {
    onSuccess: () => void;
}

const initialValues: SignupValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
}

// 이메일 형식 정규식 표현
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: SignupValues): SignupErrors {
    const errors: SignupErrors = {};

    // 이름: 필수, 30자 이하
    if (!values.name.trim()) {
        errors.name = "이름을 입력해주세요.";
    } else if (values.name.length > 30) {
        errors.name = "이름은 30자 이하로 입력해주세요.";
    }

    // 이메일: 필수, 형식
    if (!values.email.trim()) {
        errors.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_PATTERN.test(values.email)) {
        errors.email = "이메일 형식이 올바르지 않습니다.";
    }

    // 비밀번호: 필수, 8~64자
    if (!values.password) {
        errors.password = "비밀번호를 입력해주세요.";
    } else if (values.password.length < 8 || values.password.length > 64) {
        errors.password = "비밀번호는 8자 이상 64자 이하로 입력해주세요.";
    }

    // 비밀번호 확인: 필수, 비밀번호와 일치
    if (!values.passwordConfirm) {
        errors.passwordConfirm = "비밀번호를 한 번 더 입력해주세요.";
    } else if (values.passwordConfirm !== values.password) {
        errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    return errors;
}
// 회원가입 요청 실패 시 사용자에게 보여줄 문구
function getSignupErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null && "status" in err) {
        if (err.status === "FETCH_ERROR") {
            return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
        }
    }
    // 백엔드 예외 처리기 추가 전까지는 중복 이메일, 검증 실패 모두 403으로 와서 구분 불가
    return "회원가입에 실패했습니다. 이미 가입된 이메일인지 확인해주세요.";
}
export function SignupForm({onSuccess} : SignupFormProps) {

    // 필드 4개의 값의 상태 변화를 한번에 관리하기 위해 SignupValues로 묶어 관리
    const [values, setValues] = useState<SignupValues>(initialValues);
    // 요청 에러
    const [errors, setErrors] = useState<SignupErrors>({});
    // 제출시 에러
    const [submitError, setSubmitError] = useState<string | null>(null)

    const [signup, {isLoading}] = useSignupMutation();

    // 어떤 필드든 상태를 관리하는 핸들러 하나 정의
    const handleChange = (field: keyof SignupValues) => (value: string) => {
        setValues((prev) => ({...prev, [field]: value}));
        setErrors((prev) => ({...prev, [field]: undefined}));
        setSubmitError(null)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 입력 검증
        const nextErrors = validate(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSubmitError(null);

        try {
            // 비밀번호 확인은 서버로 보내지 않는다
            await signup({
                email: values.email,
                password: values.password,
                name: values.name,
            }).unwrap();
            // 페이지 이동은 SignUpPage에 맡김
            onSuccess();
        } catch (err) {
            setSubmitError(getSignupErrorMessage(err));
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Field
            label="이름"
            value={values.name}
            error={errors.name}
            onChange={handleChange('name')}/>
            <Field
            label="이메일"
            type="email"
            value={values.email}
            placeholder="example@email.com"
            error={errors.email}
            onChange={handleChange('email')}
            />
            <Field
                label="비밀번호"
                type="password"
                value={values.password}
                placeholder="8자 이상"
                error={errors.password}
                onChange={handleChange('password')}
            />
            <Field
                label="비밀번호 확인"
                type="password"
                value={values.passwordConfirm}
                error={errors.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
            />
            {submitError && <Note tone="error">{submitError}</Note>}
            <Button type="submit" disabled={isLoading}>
                {/*isLoading 상태에 따라 표기*/}
                {isLoading ? "가입 중..." : "가입하기"}
            </Button>
        </form>
    )
}