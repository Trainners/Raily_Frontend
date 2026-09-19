import { useMemo, useState } from 'react';
import { type Seat, type SeatSearchParams, useGetSeatsQuery, type Verdict, verdictOf, verdictText } from '../../../entities/seat';
import styles from './SeatMatrixPage.module.css';
import { Button, Card, LoadingScreen, Note } from '../../../shared/ui';
import FilterCarChip from '../../../features/filter-car/ui/FilterCarChip';
import SeatLegend from '../../../widgets/seat-matrix/ui/SeatLegend';
import { SeatDetailSheet } from '../../../widgets/seat-detail';
import SeatMatrix from '../../../widgets/seat-matrix/ui/SeatMatrix';
import { ReleaseSeatButton } from '../../../features/release-seat';
import { useAppSelector } from '../../../app/store/hooks';
import { selectJourneySearch, selectSelectedTrain, toSearchParams } from '../../../entities/journey';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';

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
    const selectedTrain = useAppSelector(selectSelectedTrain);
    const search = useAppSelector(selectJourneySearch);

    const seatSearchParams: SeatSearchParams | undefined =
        selectedTrain && search
            ? {
                ...toSearchParams(search),
                trainNum: selectedTrain.trainNo,
            }
            : undefined;

    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetSeatsQuery(
        seatSearchParams as SeatSearchParams,
        { skip: !seatSearchParams },
    )

    const [mySeatKey, setMySeatKey] = useState<{
        carNo: number;
        seatNo: string;
    } | null>(null);

    const [selectedCarNo, setSelectedCarNo] = useState<number | null>(null);

    // 현재 상세 시트에 띄울 좌석
    // null이면 시트를 닫힌 상태로 생각
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

    const stops = useMemo(
        () => data?.stops ?? [],
        [data],
    )

    // 서버에서 받은 좌석 데이터에 내가 착석한 좌석 상태만 mine으로 덧씌운 화면용 좌석 목록
    const displaySeats = useMemo(
        () =>
            (data?.seats ?? []).map((seat) => {
                const isMySeat =
                    mySeatKey !== null &&
                    seat.carNo === mySeatKey.carNo &&
                    seat.seatNo === mySeatKey.seatNo;

                if (!isMySeat) {
                    return seat
                }

                return {
                    ...seat,
                    // 착석은 일단 로컬 상태로만 처리
                    // 일부 구간만 판매됐어도 착석 확정 시 전 구간을 mine으로 표시
                    states: seat.states.map(() => 'mine' as const)
                }
            }),
        [data, mySeatKey]
    )

    // 응답에 있는 호차 번호만 중복 없이 뽑아서 필터 칩 목록으로 사용
    const carNos = useMemo(
        () =>
            [...new Set(displaySeats.map((seat) => seat.carNo))],
        [displaySeats]
    )

    // selectedCarNo가 null이면 필터링 없이 전체 좌석 사용
    const filteredSeats = useMemo(
        () =>
            selectedCarNo === null
                ? displaySeats
                : displaySeats.filter(
                    (seat) => seat.carNo === selectedCarNo,
                ),
        [displaySeats, selectedCarNo]
    )

    const recommendedSeat = useMemo(() => {
        // verdictOf를 reduce 비교마다 반복 호출하지 않도록
        // 좌석마다 판정 결과를 미리 한 번씩만 계산해서 같이 보관
        const seatsWithVerdict = displaySeats.map((seat) => ({
            seat,
            verdict: verdictOf(seat, stops)
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
    }, [displaySeats, stops])

    const recommendation = recommendedSeat?.verdict ?? null

    // 내가 착석한 좌석
    const mySeat = useMemo<Seat | undefined>(
        () =>
            displaySeats.find((seat) =>
                mySeatKey !== null &&
                seat.carNo === mySeatKey.carNo &&
                seat.seatNo === mySeatKey.seatNo
            ),
        [displaySeats, mySeatKey]
    )

    // 선택한 좌석을 내 자리로 기록 (구간 상태 덧씌우기는 displaySeats에서)
    const handleTakeSeat = () => {
        if (selectedSeat === null) {
            return;
        }

        setMySeatKey({
            carNo: selectedSeat.carNo,
            seatNo: selectedSeat.seatNo,
        })

        // 착석 처리가 끝나면 상세 시트 닫음
        setSelectedSeat(null);
    };

    // 내 자리 해제
    const handleReleaseSeat = () => {
        setMySeatKey(null)

        // 자리 비움 처리가 끝나면 상세 시트 닫음
        setSelectedSeat(null);
    };

    // 선택한 열차 없이 들어온 경우 여정 검색으로 이동
    if (!selectedTrain) {
        return (
            <Navigate
                to={ROUTES.JOURNEY_SETUP}
                replace
            />
        )
    }

    if (isLoading) {
        return (
            <main className={styles.page}>
                <section className={styles.content}>
                    <LoadingScreen message="좌석을 불러오는 중..." />
                </section>
            </main>
        )
    }

    // 좌석 조회 실패 화면
    // 서버가 { code, message } 형태로 실패 이유를 내려주므로 그 message를 그대로 표시
    if (isError) {
        // 서버 메시지를 꺼내지 못했을 때 쓸 기본 문구
        let message = "좌석을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."

        // error는 HTTP 응답 에러(FetchBaseQueryError)와 그 외 에러(SerializedError)의 합집합
        // status를 가진 쪽만 서버 응답 본문을 들고 있음
        if ("status" in error) {
            const errorBody = error.data;

            // error.data는 unknown이라 { message: string } 형태인지 직접 확인해야 함
            // 형태가 다르면(네트워크 끊김, 예상 못 한 응답) 기본 문구를 그대로 사용
            if (
                typeof errorBody === "object" &&
                errorBody !== null &&
                "message" in errorBody &&
                typeof errorBody.message === "string"
            ) {
                message = errorBody.message;
            }
        }

        return (
            <main className={styles.page}>
                <section className={styles.content}>
                    <Note tone="error">
                        {message}
                    </Note>
                </section>
            </main>
        )
    }

    return (
        <main className={styles.page}>
            <section className={styles.content}>
                {/* 내 좌석이 있으면 추천 계산 결과보다 내 자리 카드를 우선적으로 보여줌 */}
                {mySeat ? (
                    <>
                        <Card
                            tone="mine"
                            label="내 자리"
                            value={`${mySeat.carNo}호차 ${mySeat.seatNo} · ${stops[stops.length - 1]}까지`}
                        />

                        <Note>
                            자리가 팔리면 알림을 보내 드립니다.
                        </Note>
                    </>
                ) : (recommendedSeat && recommendation && (
                    <Card
                        label="추천"
                        value={`${recommendedSeat.seat.carNo}호차 ${recommendedSeat.seat.seatNo} · ${verdictText(recommendation)}`}
                    />
                )
                )}

                <FilterCarChip
                    carNos={carNos}
                    selectedCarNo={selectedCarNo}
                    onChange={setSelectedCarNo}
                />

                <SeatMatrix
                    // SeatMatrix는 전체 모델 형태를 기대하므로 seats만 필터링 결과로 바꿔서 전달
                    matrix={{
                        trainNo: selectedTrain.trainNo,
                        stops,
                        seats: filteredSeats,
                    }}
                    onSeatClick={setSelectedSeat}
                />

                <SeatLegend />

                {mySeat ? (
                    <ReleaseSeatButton onRelease={handleReleaseSeat} />
                ) : (
                    <Button fullWidth variant="ghost">
                        새로 조회
                    </Button>
                )}

                <SeatDetailSheet
                    seat={selectedSeat}
                    stops={stops}
                    onClose={() => setSelectedSeat(null)}
                    onTake={handleTakeSeat}
                    onRelease={handleReleaseSeat}
                />
            </section>
        </main>
    )
}