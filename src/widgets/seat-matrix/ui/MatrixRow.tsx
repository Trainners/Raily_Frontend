import { SeatCell, type Seat } from '../../../entities/seat';
import styles from './MatrixRow.module.css'

// 매트릭스 좌석 한 줄
export type MatrixRowProps = {
    seat: Seat;
}

export default function MatrixRow({ seat }: MatrixRowProps) {
    return (
        <div className={styles.row}>
            <span className={styles.seatNo}>{seat.carNo}-{seat.seatNo}</span>

            <div
                className={styles.cells}

                // 정차역 개수가 고정되지 않아서
                // repeat 활용해서 인라인 스타일로 열 개수와 너비를 동적으로 지정
                style={{ gridTemplateColumns: `repeat(${seat.states.length}, 1fr)` }}
            >
                {seat.states.map((state, index) => (
                    <SeatCell state={state} key={`${seat.seatNo}-${index}`} />
                ))}
            </div>
        </div>
    )
}