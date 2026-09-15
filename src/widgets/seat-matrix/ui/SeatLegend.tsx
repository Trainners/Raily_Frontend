import type { SeatState } from '../../../entities/seat';
import styles from './SeatLegend.module.css';

// 색상표시 + 라벨을 보여주는 범례
// entities/seat의 SeatState에 새 상태가 추가되면 여기도 같이 추가해야 함
const legendItems: { state: SeatState; label: string }[] = [
    { state: 'mine', label: '내 자리' },    // 착석 후 화면에서는 내 자리를 먼저 보여줌
    { state: 'free', label: '빈자리' },
    { state: 'sold', label: '판매됨' },
];

export default function SeatLegend() {
    return (
        <div className={styles.legend}>
            {legendItems.map(({ state, label }) => (
                <div className={styles.item} key={state}>
                    {/* state 값을 그대로 CSS 클래스 이름으로 사용 */}
                    <span className={`${styles.color} ${styles[state]}`} aria-hidden="true" />
                    <span className={styles.label}>{label}</span>
                </div>
            ))}
        </div>
    )
}