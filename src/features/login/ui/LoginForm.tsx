import {useState} from "react";
import {Button, Field} from "../../../shared/ui";
import type {LoginRequest} from "../../../entities/user";
import styles from "./LoginForm.module.css"

// 입력할 필드별 에러 문구(에러가 없는 필드는 키가 없거나 undefined)
type LoginErrors = Partial<Record<keyof LoginRequest, string>>

export type LoginFormProps = {
    // 입력검증을 통과했을 때 호출
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

export function LoginForm({onSuccess}: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginErrors>({});

    // 다시 입력을 시작한 필드의 에러만 지운다
    const handleEmailChange = (value: string) => {
        setEmail(value);
        setErrors((prev) => ({...prev, email: undefined}));
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setErrors((prev) => ({...prev, password: undefined}));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nextErrors = validate({email, password});
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSuccess();
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
            <Button type="submit">로그인</Button>
        </form>
    );
}