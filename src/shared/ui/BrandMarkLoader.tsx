import styles from './BrandMarkLoader.module.css';

export type BrandMarkLoaderProps = {
    size?: number;
};

const SEAT_POSITIONS = [
    // 열 0: 아래 → 위
    { x: 9.5, y: 49.5 },
    { x: 9.5, y: 35 },
    { x: 9.5, y: 20.5 },

    // 열 1: 위 → 아래
    { x: 22, y: 20.5 },
    { x: 22, y: 35 },
    { x: 22, y: 49.5 },

    // 열 2: 아래 → 위
    { x: 48, y: 49.5 },
    { x: 48, y: 35 },
    { x: 48, y: 20.5 },

    // 열 3: 위 → 아래
    { x: 60.5, y: 20.5 },
    { x: 60.5, y: 35 },
    { x: 60.5, y: 49.5 },
];

export default function BrandMarkLoader({
    size = 56,
}: BrandMarkLoaderProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect
                width="80"
                height="80"
                rx="20"
                fill="var(--accent-base)"
            />

            {SEAT_POSITIONS.map(({ x, y }, index) => (
                <rect
                    key={`${x}-${y}`}
                    className={styles.seat}
                    x={x}
                    y={y}
                    width="10"
                    height="10"
                    rx="2.5"
                    fill="white"
                    style={{
                        animationDelay: `${index * 0.12}s`,
                    }}
                />
            ))}
        </svg>
    )
}