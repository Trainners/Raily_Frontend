import { SeatCell, type Seat } from '../../../entities/seat';
import styles from './MatrixRow.module.css'

// 매트릭스 좌석 한 줄
export type MatrixRowProps = {
    seat: Seat;
    onSeatClick?: (seat: Seat) => void;
}

export default function MatrixRow({ seat, onSeatClick }: MatrixRowProps) {
    return (
        <div className={styles.row}>
            <span className={styles.seatNo}>{seat.carNo}-{seat.seatNo}</span>

            <div
                className={styles.cells}

                // 정차역 개수가 고정되지 않아서
                // repeat 활용해서 인라인 스타일로 열 개수와 너비를 동적으로 지정
                style={{ gridTemplateColumns: `repeat(${seat.states.length}, minmax(52px, 1fr))` }}
            >
                {seat.states.map((state, index) => (
                    <SeatCell
                        state={state}
                        key={`${seat.seatNo}-${index}`}
                        
                        // 어느 구간(state) 셀을 클릭해도 좌석 단위로 상세 정보를 열어야 하므로
                        // 구간 index와 무관하게 seat 전체를 그대로 콜백에 전달
                        onClick={() => onSeatClick?.(seat)}
                    />
                ))}
            </div>
        </div>
    )
}