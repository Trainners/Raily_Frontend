import styles from './Field.module.css'

export type FieldProps = {
    label: string;
    value: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password';
    error?: string;
    onChange: (v: string) => void;
}

export default function Field({
    label,
    value,
    placeholder,
    type = 'text',
    error,
    onChange
}: FieldProps) {
    return (
        <div className={styles.field}>
            <label className={styles.label}>{label}</label>

            <input
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                value={value}
                placeholder={placeholder}
                type={type}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}