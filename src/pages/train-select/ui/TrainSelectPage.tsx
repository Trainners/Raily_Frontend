import {Navigate, useNavigate} from "react-router-dom";
import { useGetTrainsQuery } from "../../../entities/train";
import { Note } from "../../../shared/ui";
import { TrainList, TrainListSkeleton } from "../../../widgets/train-list";
import { ROUTES } from "../../../shared/config/routes";
import type { TrainSearchParams } from "../../../entities/train";
import {useAppDispatch, useAppSelector} from "../../../app/store/hooks.ts";
import {selectJourneySearch, selectTrain, toSearchParams} from "../../../entities/journey";
import styles from "./TrainSelectPage.module.css";

export default function TrainSelectPage() {
    // 훅들
    const search = useAppSelector(selectJourneySearch);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // 훅으로 넘길 값 계산(api 요청 파라미터 형태로 변환)
    const searchParams: TrainSearchParams | undefined = search
        ? toSearchParams(search)
        : undefined

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

    // 응답을 받은 뒤에만 편수를 보여준다 (로딩 중 "0편" 방지)
    const isReady = !isLoading && !isError;

    return (
        <div className={styles.page}>
            {/* 응답이 완료된 경우에만 편수를 표시 */}
            <p className={styles.summary}>
                {search.from} → {search.to} · {search.afterTime} 이후 출발
                {isReady && ` · ${trains.length}편`}
            </p>

            {/* 로딩 */}
            {isLoading && <TrainListSkeleton/>}

            {/* 에러 */}
            {isError && (
                <Note tone="error">열차 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</Note>
            )}

            {/* 요청 성공했지만 조건에 맞는 열차가 하나도 없는 경우 */}
            {isReady && trains.length === 0 && (
                <Note tone="warn">조건에 맞는 열차가 없습니다. 시각이나 구간을 바꿔 다시 조회해주세요.</Note>
            )}

            {/* 요청 성공했고 열차가 하나 이상 있는 경우 */}
            {isReady && trains.length > 0 && (
                <TrainList
                    trains={trains}
                    onSelectTrain={(train) => {
                        // 탭바("내 여정")가 읽을 수 있게 store에 저장
                        dispatch(selectTrain(train));
                        navigate(ROUTES.SEAT_MATRIX);
                    }}
                />
            )}

            <Note>
                정차역 정보가 없는 열차는 매트릭스를 만들 수 없어 목록에서 제외됩니다.
            </Note>
        </div>
    )
}