import type { SeatMatrix as SeatMatrixModel } from "../model"
import MatrixHeader from "./MatrixHeader"
import MatrixRow from "./MatrixRow"
import styles from './SeatMatrix.module.css'

// 매트릭스 조립, 매트릭스 헤더 아래에 매트릭스 로우 배치
export type SeatMatrixProps = {
    matrix: SeatMatrixModel
}

export default function SeatMatrix({ matrix }: SeatMatrixProps) {
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
                    />
                ))}
            </div>
        </div>
    )
}