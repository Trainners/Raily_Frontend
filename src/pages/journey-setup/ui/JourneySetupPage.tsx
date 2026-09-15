import { useNavigate } from "react-router-dom";
import { JourneyForm } from "../../../widgets/journey-form";
import { ROUTES } from "../../../shared/config/routes";
import styles from './JourneySetupPage.module.css'

const mockRecentSegment = {
    from: '천안',
    to: '영등포'
}

// 열차 설정에서 출발역/도착역/날짜/시각 입력하는 JourneyForm 보여주는 페이지
// 열차 선택 화면으로 폼 입력값(목업) 넘기면서 이동
export default function JourneySetupPage() {
    const navigate = useNavigate();

    return (
        <main className={styles.page}>
            <JourneyForm
                recentSegment={mockRecentSegment}
                onSubmit={(values) => {
                    // 라우터 state로 넘겨서 TrainSelectPage에서 location.state 그대로 받음
                    navigate(ROUTES.TRAIN_SELECT, {
                        state: values
                    })
                }}
            />
        </main>
    );
}