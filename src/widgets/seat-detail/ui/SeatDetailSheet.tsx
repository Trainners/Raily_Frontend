import { verdictOf, verdictText, type Seat } from '../../../entities/seat';
import { TakeSeatButton } from '../../../features/take-seat';
import { Note, Sheet } from '../../../shared/ui';
import styles from './SeatDetailSheet.module.css';

// 매트릭스에서 좌석을 탭했을 때 나오는 상세 시트
export type SeatDetailSheetProps = {
    seat: Seat | null;      // 선택된 좌석, null이면 시트 닫힘
    stops: string[];        // 정차역 목록
    onClose: () => void;    // 오버레이 클릭 또는 닫기 버튼으로 시트 닫기 요청
    onTake: () => void;     // 선택한 좌석에 앉기 버튼 눌렀을 때 실행하는 콜백
}

// SeatCell에서 빈/판매로 표현되는 것과 다르게 풀네임으로 보여줌
const stateText: Record<Seat['states'][number], string> = {
    free: '빈자리',
    sold: '판매됨',
    mine: '내 자리',
}

export default function SeatDetailSheet({
    seat,
    stops,
    onClose,
    onTake
}: SeatDetailSheetProps) {
    if (seat === null) {
        return null;
    }

    const verdict = verdictOf(seat, stops);

    // 인접한 두 역을 구간으로 묶고 좌석 상태도 같이 붙여서 보여줌
    const segments = stops.slice(0, -1).map((from, index) => ({
        from,
        to: stops[index + 1],
        state: seat.states[index],
    }))

    return (
        <Sheet open={seat !== null} onClose={onClose}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h2 className={styles.title}>
                        {seat.carNo}호차 {seat.seatNo}
                    </h2>

                    <button
                        className={styles.close}
                        type="button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                <div className={styles.segments}>
                    {segments.map(({ from, to, state }) => (
                        <div className={styles.segment} key={`${from}-${to}`}>
                            <span className={styles.route}>
                                {from} → {to}
                            </span>

                            <span className={`${styles.state} ${styles[state]}`}>
                                {stateText[state]}
                            </span>
                        </div>
                    ))}
                </div>

                <Note>{verdictText(verdict)}</Note>

                <TakeSeatButton onTake={onTake} />
            </div>
        </Sheet>
    )
}