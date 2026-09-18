import {Navigate, useNavigate} from "react-router-dom";
import { useGetTrainsQuery } from "../../../entities/train";
import { Note } from "../../../shared/ui";
import { TrainList } from "../../../widgets/train-list";
import { ROUTES } from "../../../shared/config/routes";
import type { TrainSearchParams } from "../../../entities/train/model/types";
import {useAppDispatch, useAppSelector} from "../../../app/store/hooks.ts";
import {selectJourneySearch, selectTrain} from "../../../entities/journey";

export default function TrainSelectPage() {
    // 훅들
    const search = useAppSelector(selectJourneySearch);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // 훅으로 넘길 값 계산(api 요청 파라미터 형태로 변환)
    const searchParams: TrainSearchParams | undefined = search
        ? {
            departureStation: search.from,
            arrivalStation: search.to,
            // 백엔드가 date/time을 yyyyMMdd/HHmmss 숫자 형식으로 받아서
            // 화면 표시용 문자열에서 숫자만 뽑아 변환
            date: search.date.replace(/[^0-9]/g, ''),
            time: search.afterTime.replace(/[^0-9]/g, '') + '00',
        }
        : undefined;

    // search가 없으면 skip으로 요청 블로킹
    const {data:trains = [], isLoading, isError} = useGetTrainsQuery(
        searchParams as TrainSearchParams,
        //skip으로 요청만 막음
        {skip: !search},
    );

    // 검색 조건 없이 들어오면 (url입력이나 새로고침 인 경우) 여정 검색으로 강제 라우팅한다.
    if (!search) {
        return <Navigate to={ROUTES.JOURNEY_SETUP} replace />;
    }
    return (
        <main>
            {/* 이후 별도의 검색 조건 요약 바 컴포넌트로 분리 예정 */}
            <p>{search.afterTime} 이후 출발 · {trains.length}편</p>

            {isLoading && <p>열차 정보를 불러오는 중입니다.</p>}

            {isError && (<p>열차 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>)}

            {!isLoading && !isError && (
                <TrainList
                    trains={trains}
                    onSelectTrain={(train) => {
                        // 탭바("내 여정")가 읽을 수 있게 store에 저장
                        dispatch(selectTrain(train));
                        // SeatMatrixPage는 #30 전까지 location.state로 열차를 받으므로 함께 넘긴다
                        // TODO(#30): SeatMatrixPage가 selectSelectedTrain을 읽게 되면 state 전달 제거
                        navigate(ROUTES.SEAT_MATRIX, { state: train });
                    }}
                />
            )}

            <Note>
                정차역 정보가 없는 열차는 매트릭스를 만들 수 없어 목록에서 제외됩니다.
            </Note>
        </main>
    )
}