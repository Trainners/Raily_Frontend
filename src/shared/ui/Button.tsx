import styles from './Button.module.css'

export type ButtonProps = {
    variant?: 'primary' | 'ghost';
    size?: 'md' | 'sm';
    fullWidth?: boolean;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth = true,
    disabled,
    onClick,
    children
}: ButtonProps) {

    return (
        <button
            className={`${styles.base} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}