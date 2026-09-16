import { useLocation, useNavigate } from "react-router-dom";
import { useGetTrainsQuery } from "../../../entities/train";
import { Note } from "../../../shared/ui";
import { TrainList } from "../../../widgets/train-list";
import { ROUTES } from "../../../shared/config/routes";
import type { TrainSearchParams } from "../../../entities/train/model/types";

// JourneySetupPage에서 navigate로 넘기는 폼 입력값하고 같은 형태
type JourneySearchState = {
    from: string;
    to: string;
    date: string;
    afterTime: string;
}

export default function TrainSelectPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // JourneySetupPage 안 거치고 바로 들어오면 state 없을 수도 있어서 null 허용
    const searchState = location.state as JourneySearchState | null;

    // state 없을 때는 기존에 하드코딩 했던 기본값으로 대체
    const afterTime = searchState?.afterTime ?? '07:00';

    // 화면에서 사용하는 검색 조건을 API 요청 파라미터 형태로 변환
    const searchParams: TrainSearchParams | undefined = searchState
        ? {
            departureStation: searchState.from,
            arrivalStation: searchState.to,
            // 백엔드가 date/time을 yyyyMMdd/HHmm 숫자 형식으로 받아서
            // 화면 표시용 문자열에서 숫자만 뽑아 변환
            date: searchState.date.replace(/[^0-9]/g, ''),
            time: searchState.afterTime.replace(/[^0-9]/g, '')
        }
        : undefined;

    const {
        data: trains = [],
        isLoading,
        isError,
    } = useGetTrainsQuery(searchParams as TrainSearchParams, {
        skip: !searchState
    })

    return (
        <main>
            {/* 이후 별도의 검색 조건 요약 바 컴포넌트로 분리 예정 */}
            <p>{afterTime} 이후 출발 · {trains.length}편</p>

            {isLoading && <p>열차 정보를 불러오는 중입니다.</p>}

            {isError && (<p>열차 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>)}

            {!isLoading && !isError && (
                <TrainList
                    trains={trains}
                    onSelectTrain={(train) => {
                        // 선택한 열차 정보를 라우터 state로 넘겨서 SeatMatrixPage에서 location.state로 받음
                        navigate(ROUTES.SEAT_MATRIX, {
                            state: train
                        })
                    }}
                />
            )}

            <Note>
                정차역 정보가 없는 열차는 매트릭스를 만들 수 없어 목록에서 제외됩니다.
            </Note>
        </main>
    )
}