import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JourneyForm } from "../../../widgets/journey-form";
import { ROUTES } from "../../../shared/config/routes";
import { useAppDispatch } from "../../../app/store/hooks.ts";
import { getRecentSegment, saveRecentSegment, setSearch } from "../../../entities/journey";
import styles from './JourneySetupPage.module.css'

// 열차 설정에서 출발역/도착역/날짜/시각 입력하는 JourneyForm 보여주는 페이지
// 폼 입력값을 journeySlice에 저장하고 열차 선택 화면으로 이동
// 조회한 구간은 다음 방문에 '최근 구간'으로 채울 수 있게 localStorage에도 남긴다
export default function JourneySetupPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // 최초 렌더 때 한 번만 저장소를 읽는다 (지연 초기화)
    // useEffect로 읽으면 첫 프레임엔 카드가 없다가 뒤늦게 나타난다
    const [recentSegment] = useState(
        () => getRecentSegment(),
    );

    return (
        <main className={styles.page}>
            <JourneyForm
                // JourneyForm의 recentSegment는 선택적 prop이라 null 대신 undefined를 넘긴다
                recentSegment={recentSegment ?? undefined}
                onSubmit={(values) => {
                    // 검색 조건을 라우터 state 대신 store에 저장
                    // TrainSelectPage가 진입 경로와 무관하게 같은 값을 읽는다
                    dispatch(setSearch(values));

                    // 폼에 입력 검증이 없어 빈 값으로도 제출된다
                    // 빈 구간을 저장하면 다음 방문에 '→'만 있는 카드가 뜨므로 둘 다 채워졌을 때만 남긴다
                    if (values.from && values.to) {
                        saveRecentSegment({
                            from: values.from,
                            to: values.to,
                        })
                    }

                    navigate(ROUTES.TRAIN_SELECT);
                }}
            />
        </main>
    );
}