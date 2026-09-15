import { useMemo, useState } from 'react';
import { type Seat, type Verdict, verdictOf, verdictText } from '../../../entities/seat';
import { type SeatMatrix as SeatMatrixModel } from '../../../widgets/seat-matrix/model'
import styles from './SeatMatrixPage.module.css';
import { Button, Card } from '../../../shared/ui';
import FilterCarChip from '../../../features/filter-car/ui/FilterCarChip';
import SeatLegend from '../../../widgets/seat-matrix/ui/SeatLegend';
import { SeatDetailSheet } from '../../../widgets/seat-detail';
import SeatMatrix from '../../../widgets/seat-matrix/ui/SeatMatrix';

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
    // 좌석 선택하면 selectedSeat에 저장하고 착석하면 matrix 상태 변경
    const [matrix, setMatrix] = useState<SeatMatrixModel>(mockSeatMatrix);

    const [selectedCarNo, setSelectedCarNo] = useState<number | null>(null);

    // 현재 상세 시트에 띄울 좌석
    // null이면 시트를 닫힌 상태로 생각
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

    // 목업 데이터에 있는 호차 번호만 중복 없이 뽑아서 필터 칩 목록으로 사용
    const carNos = useMemo(
        () =>
            [...new Set(matrix.seats.map((seat) => seat.carNo))],
        [matrix.seats]
    )

    // selectedCarNo가 null이면 필터링 없이 전체 좌석 사용
    const filteredSeats = useMemo(
        () =>
            selectedCarNo === null
                ? matrix.seats
                : matrix.seats.filter(
                    (seat) => seat.carNo === selectedCarNo,
                ),
        [matrix.seats, selectedCarNo]
    )

    const recommendedSeat = useMemo(() => {
        // verdictOf를 reduce 비교마다 반복 호출하지 않도록
        // 좌석마다 판정 결과를 미리 한 번씩만 계산해서 같이 보관
        const seatsWithVerdict = matrix.seats.map((seat) => ({
            seat,
            verdict: verdictOf(seat, matrix.stops)
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
    }, [matrix.seats, matrix.stops])

    const recommendation = recommendedSeat?.verdict ?? null

    // 선택한 좌석의 모든 구간 상태를 mine으로 변경
    const handleTakeSeat = () => {
        if (selectedSeat === null) {
            return;
        }

        setMatrix((currentMatrix) => ({
            ...currentMatrix,
            seats: currentMatrix.seats.map((seat) => {
                // 호차 안에서는 seatNo가 유일하지만 호차가 다르면 seatNo가 겹칠 수 있어서
                // carNo까지 같이 비교해야 정확히 같은 좌석을 찾을 수 있음
                const isSelectedSeat =
                    seat.carNo === selectedSeat.carNo &&
                    seat.seatNo === selectedSeat.seatNo;

                if (!isSelectedSeat) {
                    return seat;
                }

                return {
                    ...seat,
                    // 실제로는 일부 구간만 판매됐어도 착석 확정 시 전 구간을 mine으로 처리
                    // 추후 연동 시 재검토 필요
                    states: seat.states.map(() => 'mine' as const),
                };
            }),
        }));

        // 착석 처리가 끝나면 상세 시트 닫음
        setSelectedSeat(null);
    };

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
                        ...matrix,
                        seats: filteredSeats,
                    }}
                    onSeatClick={setSelectedSeat}
                />

                <SeatLegend />

                <Button fullWidth variant="ghost">
                    새로 조회
                </Button>

                <SeatDetailSheet
                    seat={selectedSeat}
                    stops={matrix.stops}
                    onClose={() => setSelectedSeat(null)}
                    onTake={handleTakeSeat}
                />
            </section>
        </main>
    )
}