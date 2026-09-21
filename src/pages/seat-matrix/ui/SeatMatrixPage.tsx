import { useMemo, useState } from 'react';
import { type Seat, type SeatSearchParams, useGetSeatsQuery, verdictOf, verdictText } from '../../../entities/seat';
import styles from './SeatMatrixPage.module.css';
import { Button, Card, LoadingScreen, Note } from '../../../shared/ui';
import FilterCarChip from '../../../features/filter-car/ui/FilterCarChip';
import SeatLegend from '../../../widgets/seat-matrix/ui/SeatLegend';
import { SeatDetailSheet } from '../../../widgets/seat-detail';
import SeatMatrix from '../../../widgets/seat-matrix/ui/SeatMatrix';
import { ReleaseSeatButton } from '../../../features/release-seat';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
    releaseSeat,
    selectJourneySearch,
    selectSeatInfo,
    selectSelectedTrain,
    takeSeat,
    toSearchParams,
} from '../../../entities/journey';
import {
    useCancelSeatWatchMutation,
    useCreateSeatWatchMutation,
    useGetSeatWatchQuery,
} from '../../../entities/notification';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';

// 감시 상태 폴링 주기
// 좌석 조회와 달리 이 요청은 서버가 자기 DB 한 줄만 읽으므로 코레일 호출이 없다
const SEAT_WATCH_POLL_MS = 20_000;

/*
코레일 호차 번호(h_srcar_no)는 '0003' 형태의 4자리 0패딩 문자열이다.
좌석 조회 응답은 이미 숫자(3)로 내려오므로 감시 등록 요청에서는 원래 형식으로 되돌린다.

백엔드 SeatAvailabilityChecker.findCar()가 코레일 원본과 문자열로 비교하기 때문에
'3'을 보내면 호차를 찾지 못하고, 그것을 '팔림'으로 단정해 착석 직후 가짜 알림이 발송된다.
백엔드가 숫자 비교로 바꾸더라도 '0003'은 그대로 통과하므로 양쪽 모두 안전하다.
*/
const toCarNumberParam = (carNo: number) => String(carNo).padStart(4, '0');

/*
selectedTrain의 시각은 formatApiTime이 'HH:mm'으로 바꿔 둔 값이다.
백엔드는 'HHmmss' 6자리를 요구하므로 숫자만 남기고 초를 붙인다.
toSearchParams가 afterTime을 변환하는 방식과 같다.
*/
const toTimeParam = (time: string) => `${time.replace(/[^0-9]/g, '')}00`;

export default function SeatMatrixPage() {
    const dispatch = useAppDispatch();
    const selectedTrain = useAppSelector(selectSelectedTrain);
    const search = useAppSelector(selectJourneySearch);
    // 착석 정보는 화면을 벗어나도 유지돼야 하므로 로컬 state가 아니라 journeySlice에 둔다
    const seatInfo = useAppSelector(selectSeatInfo);

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

    const [createSeatWatch, { isLoading: isRegistering }] = useCreateSeatWatchMutation();
    const [cancelSeatWatch, { isLoading: isCancelling }] = useCancelSeatWatchMutation();

    // 감시 등록/취소 실패 안내. 성공하면 비운다
    const [watchError, setWatchError] = useState<string | null>(null);

    const seatWatchId = seatInfo?.seatWatchId ?? null;

    /*
    푸시를 받지 못하는 사용자(알림 권한 거부, 홈 화면에 추가하지 않은 iOS)를 위한 폴백이다.
    포그라운드에서만 돌도록 skipPollingIfUnfocused를 켰다. store.ts의 setupListeners가 이 옵션의 전제다.
    자리를 비우면 seatWatchId가 null이 되어 skip으로 폴링이 멈춘다.
    */
    const { data: seatWatch } = useGetSeatWatchQuery(
        seatWatchId as number,
        {
            skip: seatWatchId === null,
            pollingInterval: SEAT_WATCH_POLL_MS,
            skipPollingIfUnfocused: true,
        },
    )

    // 서버가 판매를 감지한 역. 감시 상태에서 바로 파생시키고 전역 상태로 올리지 않는다
    // (전역으로 올리면 폴링이 돌 때마다 같은 액션이 반복 dispatch되지 않게 막는 코드가 또 필요하다)
    const soldFromStation =
        seatWatch?.status === 'NOTIFIED' ? seatWatch.soldFromStation : null;

    const [selectedCarNo, setSelectedCarNo] = useState<number | null>(null);

    // 현재 상세 시트에 띄울 좌석
    // null이면 시트를 닫힌 상태로 생각
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

    const stops = useMemo(
        () => data?.stops ?? [],
        [data],
    )

    /*
    내가 착석한 좌석인지 판정한다.
    trainNo를 함께 보는 이유: setSearch는 seatInfo를 비우지 않으므로,
    다른 열차를 골라도 같은 호차·좌석이 '내 자리'로 칠해질 수 있다.
    selectedTrain은 아래 가드 전이라 아직 null일 수 있어 옵셔널 체이닝을 쓴다.
    */
    const isMySeat = useMemo(
        () => (seat: Seat) =>
            seatInfo !== null &&
            seatInfo.trainNo === selectedTrain?.trainNo &&
            seat.carNo === seatInfo.carNo &&
            seat.seatNo === seatInfo.seatNo,
        [seatInfo, selectedTrain],
    )

    // 서버에서 받은 좌석 데이터에 내가 착석한 좌석 상태만 mine으로 덧씌운 화면용 좌석 목록
    const displaySeats = useMemo(
        () =>
            (data?.seats ?? []).map((seat) => {
                if (!isMySeat(seat)) {
                    return seat
                }

                return {
                    ...seat,
                    // 일부 구간만 판매됐어도 착석 확정 시 전 구간을 mine으로 표시
                    states: seat.states.map(() => 'mine' as const)
                }
            }),
        [data, isMySeat]
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

    // 서버에서 우선순위에 따라 정렬해준 좌석 중 첫 번째 좌석을 추천
    const recommendedSeat = displaySeats[0]

    const recommendation = recommendedSeat ? verdictOf(recommendedSeat, stops) : null

    // 내가 착석한 좌석
    const mySeat = useMemo<Seat | undefined>(
        () => displaySeats.find(isMySeat),
        [displaySeats, isMySeat]
    )

    // 등록/취소 요청 중에는 버튼을 잠근다
    const isSubmitting = isRegistering || isCancelling;

    /*
    선택한 좌석을 서버에 감시 등록하고, 성공했을 때만 착석 상태로 바꾼다.
    .unwrap()이 있어야 실패 시 throw된다. 빼면 실패해도 다음 줄로 넘어가 착석 처리가 되어버린다.
    */
    const handleTakeSeat = async () => {
        if (selectedSeat === null || selectedTrain === null || search === null) {
            return;
        }

        setWatchError(null);

        try {
            const { id } = await createSeatWatch({
                trainNumber: selectedTrain.trainNo,
                carNumber: toCarNumberParam(selectedSeat.carNo),
                seatNumber: selectedSeat.seatNo,
                runDate: toSearchParams(search).date,
                fromStation: search.from,
                toStation: search.to,
                departureTime: toTimeParam(selectedTrain.departureTime),
                arrivalTime: toTimeParam(selectedTrain.arrivalTime),
            }).unwrap();

            dispatch(takeSeat({
                seatWatchId: id,
                trainNo: selectedTrain.trainNo,
                carNo: selectedSeat.carNo,
                seatNo: selectedSeat.seatNo,
                fromStation: search.from,
                toStation: search.to,
            }));

            // 착석 처리가 끝나면 상세 시트 닫음
            setSelectedSeat(null);
        } catch {
            setWatchError('자리를 등록하지 못했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    /*
    내 자리 해제.
    서버 취소가 실패해도 화면은 비운다. 서버는 여정 종료 시각에 EXPIRED로 정리하므로
    여기서 막아 세우면 사용자만 자리를 옮기지 못한다.
    */
    const handleReleaseSeat = async () => {
        setWatchError(null);

        if (seatWatchId !== null) {
            await cancelSeatWatch(seatWatchId).unwrap().catch(() => undefined);
        }

        dispatch(releaseSeat());

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

    // 조회는 성공했지만 조회 가능한 좌석이 하나도 없는 경우
    // 모든 좌석이 전 구간 매진이면 백엔드가 해당 좌석을 제외하므로
    // displaySeats가 빈 배열이 되어 이 분기에 걸림
    if (displaySeats.length === 0) {
        return (
            <main className={styles.page}>
                <section className={styles.content}>
                    <Note tone="warn">
                        조회된 좌석이 없습니다.
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

                        {/* 알림은 좌석이 팔리는 순간이 아니라 각 정차역 도착 10분 전부터 서버가 확인해 보낸다.
                            그래서 '실시간'이라고 쓰지 않는다 */}
                        {soldFromStation ? (
                            <Note tone="warn">
                                {soldFromStation}역부터 좌석이 판매되었습니다. 다른 자리로 이동해 주세요.
                            </Note>
                        ) : (
                            <Note>
                                앉은 좌석이 팔리면 새 승객이 타기 전에 미리 알려 드립니다.
                            </Note>
                        )}
                    </>
                ) : (recommendedSeat && recommendation && (
                    <Card
                        label="추천"
                        value={`${recommendedSeat.carNo}호차 ${recommendedSeat.seatNo} · ${verdictText(recommendation)}`}
                    />
                )
                )}

                {watchError && (
                    <Note tone="error">
                        {watchError}
                    </Note>
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
                    <ReleaseSeatButton onRelease={handleReleaseSeat} disabled={isSubmitting} />
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
                    isSubmitting={isSubmitting}
                />
            </section>
        </main>
    )
}
