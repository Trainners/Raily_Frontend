import styles from './Chip.module.css';

export type ChipProps = {
    label: string;
    selected?: boolean;
    onClick?: () => void;
};

export default function Chip({
    label,
    selected = false,
    onClick,
}: ChipProps) {
    return (
        <button
            type="button"
            className={`${styles.chip} ${selected ? styles.selected : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}