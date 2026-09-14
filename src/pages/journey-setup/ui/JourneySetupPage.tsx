import { JourneyForm } from "../../../widgets/journey-form";
import styles from './JourneySetupPage.module.css'

const mockRecentSegment = {
    from: '천안',
    to: '영등포'
}

// 열차 설정에서 출발역/도착역/날짜/시각 입력하는 JourneyForm 보여주는 페이지
// 열차 선택 화면으로 이어질 예정이고 지금은 목업 데이터로 콘솔 로그 남김
export default function JourneySetupPage() {
    return (
        <main className={styles.page}>
            <JourneyForm
                recentSegment={mockRecentSegment}
                onSubmit={(values) => console.log(values)}
            />
        </main>
    );
}