import styles from './Button.module.css'

export type ButtonProps = {
    variant?: 'primary' | 'ghost';
    size?: 'md' | 'sm';
    // 폼 안에서 이 버튼 컴포넌트를 통해 제출할 때 폼 제출이 되지 않도록 제출 타입을 지정한다
    // 기본을 'button으로 두고 제출 버튼만 명시적으로 submit로 동작할 수 있도록 한다.
    type?: 'button' | 'submit';
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    // 버튼 기본값은 button으로(제출이 필요할때에는 명시적으로 submit를 사용)
    type = 'button',
    fullWidth = true,
    disabled,
    onClick,
    children
}: ButtonProps) {

    return (
        <button
            // 태그에 타입 전달
            type={type}
            className={`${styles.base} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}