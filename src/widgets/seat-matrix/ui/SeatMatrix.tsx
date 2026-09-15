import type { SeatMatrix as SeatMatrixModel } from "../model"
import MatrixHeader from "./MatrixHeader"
import MatrixRow from "./MatrixRow"
import styles from './SeatMatrix.module.css'

// 매트릭스 조립, 매트릭스 헤더 아래에 매트릭스 로우 배치
export type SeatMatrixProps = {
    matrix: SeatMatrixModel
    // 좌석 클릭 처리는 이 위젯에서 직접 안 하고 상위 페이지로 위임
    onSeatClick?: (seat: SeatMatrixModel['seats'][number]) => void;
}

export default function SeatMatrix({ matrix, onSeatClick }: SeatMatrixProps) {
    const { stops, seats } = matrix

    return (
        <div className={styles.matrix}>
            <MatrixHeader stops={stops} />

            <div className={styles.rows}>
                {seats.map((seat) => (
                    <MatrixRow
                        // seatNo만으로는 호차가 다르면 겹칠 수 있어서 carNo까지 합쳐서 key로 사용
                        key={`${seat.carNo}-${seat.seatNo}`}
                        seat={seat}
                        onSeatClick={onSeatClick}
                    />
                ))}
            </div>
        </div>
    )
}