import styles from './LoadingScreen.module.css'
import BrandMarkLoader from "./BrandMarkLoader.tsx";

export type LoadingScreenProps = {
    // 상황별 안내문구(막는 가드마다 다른 안내문구를 출력하기위함
    message?:string;
};

export default function LoadingScreen({ message = "불러오는 중..."}:LoadingScreenProps) {
    return (
        // 스크린 쉘 아래에서 진행중임을 표시함
        <div className={styles.screen} role="status" aria-live="polite">
            <BrandMarkLoader size={96} />
            <p className={styles.message}>{message}</p>
        </div>
    )
}