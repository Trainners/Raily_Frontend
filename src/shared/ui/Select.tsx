import styles from './Select.module.css'

export type SelectProps = {
    label: string;
    value?: string;
    placeholder?: string;
    onOpen: () => void;
}

export default function Select({
    label,
    value,
    placeholder,
    onOpen
}: SelectProps) {
    const hasValue = Boolean(value)

    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>

            <button
                type='button'
                className={styles.trigger}
                onClick={onOpen}
            >
                <span className={hasValue ? styles.value : styles.placeholder}>
                    {value ?? placeholder}
                </span>
                <span className={styles.icon} aria-hidden="true">
                    ▾
                </span>
            </button>
        </div>
    )
}