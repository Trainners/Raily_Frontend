import styles from './Segment.module.css'

export type SegmentProps<T extends string> = {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}

export default function Segment<T extends string>({
    options,
    value,
    onChange
}: SegmentProps<T>) {

    return (
        <div className={styles.segment}>
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={`${styles.option} ${selected ? styles.selected : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}