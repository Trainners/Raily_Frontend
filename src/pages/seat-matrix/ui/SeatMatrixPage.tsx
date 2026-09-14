import { useMemo, useState } from 'react';
import { type Seat, type Verdict, verdictOf, verdictText } from '../../../entities/seat';
import type { SeatMatrix as SeatMatrixModel } from '../../../widgets/seat-matrix/model'
import styles from './SeatMatrixPage.module.css';
import { Button, Card } from '../../../shared/ui';
import FilterCarChip from '../../../features/filter-car/ui/FilterCarChip';
import SeatMatrix from '../../../widgets/seat-matrix/ui/SeatMatrix';
import SeatLegend from '../../../widgets/seat-matrix/ui/SeatLegend';

// 임시 목업 데이터
const mockSeatMatrix: SeatMatrixModel = {
    trainNo: 'KTX-001',
    stops: ['천안', '평택', '오산', '수원', '영등포'],
    seats: [
        {
            carNo: 1,
            seatNo: '1A',
            states: ['free', 'free', 'free', 'free'],
        },
        {
            carNo: 1,
            seatNo: '1B',
            states: ['free', 'sold', 'free', 'free'],
        },
        {
            carNo: 1,
            seatNo: '2A',
            states: ['sold', 'sold', 'free', 'free'],
        },
        {
            carNo: 2,
            seatNo: '1A',
            states: ['free', 'free', 'sold', 'sold'],
        },
        {
            carNo: 2,
            seatNo: '1B',
            states: ['sold', 'free', 'free', 'free'],
        },
        {
            carNo: 2,
            seatNo: '2A',
            states: ['sold', 'sold', 'sold', 'sold'],
        },
        {
            carNo: 3,
            seatNo: '1A',
            states: ['free', 'free', 'free', 'sold'],
        },
        {
            carNo: 3,
            seatNo: '1B',
            states: ['free', 'sold', 'free', 'sold'],
        },
    ],
}

// 좌석의 verdictOf 결과를 기준으로 가장 오래 앉아갈 수 있는 좌석 선택
// 우선순위는 full > until/from > partial > none
const verdictPriority: Record<Verdict['kind'], number> = {
    full: 0,
    until: 1,
    from: 1,
    partial: 2,
    none: 3,
}

export default function SeatMatrixPage() {
    const [selectedCarNo, setSelectedCarNo] = useState<number | null>(null);

    // 목업 데이터에 있는 호차 번호만 중복 없이 뽑아서 필터 칩 목록으로 사용
    const carNos = useMemo(
        () =>
            [...new Set(mockSeatMatrix.seats.map((seat) => seat.carNo))],
        []
    )

    // selectedCarNo가 null이면 필터링 없이 전체 좌석 사용
    const filteredSeats = useMemo(
        () =>
            selectedCarNo === null
                ? mockSeatMatrix.seats
                : mockSeatMatrix.seats.filter(
                    (seat) => seat.carNo === selectedCarNo,
                ),
        [selectedCarNo]
    )

    const recommendedSeat = useMemo(() => {
        // verdictOf를 reduce 비교마다 반복 호출하지 않도록
        // 좌석마다 판정 결과를 미리 한 번씩만 계산해서 같이 보관
        const seatsWithVerdict = mockSeatMatrix.seats.map((seat) => ({
            seat,
            verdict: verdictOf(seat, mockSeatMatrix.stops)
        }))

        // verdictPriority 숫자가 더 작은 좌석을 계속 살아남기는 방식으로 순회
        return seatsWithVerdict.reduce<{
            seat: Seat;
            verdict: Verdict;
        } | null>((best, current) => {
            if (!best) {
                return current
            }

            const currentPriority = verdictPriority[current.verdict.kind]
            const bestPriority = verdictPriority[best.verdict.kind]

            return currentPriority < bestPriority
                ? current
                : best
        }, null)
    }, [])

    const recommendation = recommendedSeat?.verdict ?? null

    return (
        <main className={styles.page}>
            <section className={styles.content}>
                {recommendedSeat && recommendation && (
                    <Card
                        label="추천"
                        value={`${recommendedSeat.seat.carNo}호차 ${recommendedSeat.seat.seatNo} · ${verdictText(recommendation)}`}
                    />
                )}

                <FilterCarChip
                    carNos={carNos}
                    selectedCarNo={selectedCarNo}
                    onChange={setSelectedCarNo}
                />

                <SeatMatrix
                // SeatMatrix는 전체 모델 형태를 기대하므로 seats만 필터링 결과로 바꿔서 전달
                    matrix={{
                        ...mockSeatMatrix,
                        seats: filteredSeats,
                    }}
                />

                <SeatLegend />

                <Button fullWidth variant="ghost">
                    새로 조회
                </Button>
            </section>
        </main>
    )
}