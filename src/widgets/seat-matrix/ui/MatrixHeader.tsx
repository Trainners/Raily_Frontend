import styles from './MatrixHeader.module.css'

// 매트릭스 최상단에 정차역 이름 나열
export type MatrixHeaderProps = {
    stops: string[]
}

export default function MatrixHeader({ stops }: MatrixHeaderProps) {
    // 인접한 두 역을 하나의 구간으로 묶기
    const segments = stops.slice(0, -1).map((from, index) => ({
        from,
        to: stops[index + 1],
    }));

    return (
        <div className={styles.header}>
            <span className={styles.spacer}>좌석</span>

            <div
                className={styles.cells}

                // 정차역 개수가 고정되지 않아서
                // repeat 활용해서 인라인 스타일로 열 개수와 너비를 동적으로 지정
                style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(52px, 1fr))` }}
            >
                {segments.map(({from, to}) => (
                    <span className={styles.segments} key={`${from}-${to}`}>
                        <span>{from}</span>
                        <span>{to}</span>
                    </span>
                ))}
            </div>
        </div>
    )
}