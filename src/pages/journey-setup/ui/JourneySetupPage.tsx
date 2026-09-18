import { useNavigate } from "react-router-dom";
import { JourneyForm } from "../../../widgets/journey-form";
import { ROUTES } from "../../../shared/config/routes";
import styles from './JourneySetupPage.module.css'
import {useAppDispatch} from "../../../app/store/hooks.ts";
import {setSearch} from "../../../entities/journey";

const mockRecentSegment = {
    from: '천안',
    to: '영등포'
}

// 열차 설정에서 출발역/도착역/날짜/시각 입력하는 JourneyForm 보여주는 페이지
// 폼 입력값을 journeySlice에 저장하고 열차 선택 화면으로 이동
export default function JourneySetupPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    return (
        <main className={styles.page}>
            <JourneyForm
                recentSegment={mockRecentSegment}
                onSubmit={(values) => {
                    // 검색 조건을 라우터 state 대신 store에 저장
                    // TrainSelectPage가 진입 경로와 무관하게 같은 값을 읽는다
                    dispatch(setSearch(values));
                    navigate(ROUTES.TRAIN_SELECT);
                }}
            />
        </main>
    );
}