import {Link, useLocation} from "react-router-dom";
import {ROUTES} from "../../../shared/config/routes.ts";
import {useAppSelector} from "../../../app/store/hooks.ts";
import {selectSelectedTrain} from "../../../entities/journey";
import styles from "./TabBar.module.css"

type TabItem = {
    label: string;
    to: string;
    // 이 경로들 중 하나에 있으면 해당 아이템 활성화
    matches: string[];
    requiresJourney?: boolean;
}

const TABS: TabItem[] = [
    { label: '홈',     to: ROUTES.JOURNEY_SETUP, matches: [ROUTES.JOURNEY_SETUP, ROUTES.TRAIN_SELECT] },
    { label: '내 여정', to: ROUTES.SEAT_MATRIX,   matches: [ROUTES.SEAT_MATRIX], requiresJourney: true },
    { label: '설정',   to: ROUTES.SETTINGS,      matches: [ROUTES.SETTINGS] },
];

export function TabBar() {

    const { pathname } = useLocation();
    //selectHasJourney의 boolean 값 대신 열차 자체를 읽도록 한다. ("내 여정" 링크에 state로 실어보내야 하므로)
    const selectedTrain = useAppSelector(selectSelectedTrain);
    const hasJourney = selectedTrain !== null;

    return(
        <nav className={styles.bar} aria-label="하단 네비게이션바">
            {TABS.map((tab) => {
                const isActive = tab.matches.includes(pathname);
                const isDisabled = tab.requiresJourney === true && !hasJourney;
                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        // SeatMatrixPage가 #30 전까지 location.state로 열차를 받으므로 함께 넘긴다
                        // TODO(#30): SeatMatrixPage가 store를 읽게 되면 제거
                        state={tab.requiresJourney ? selectedTrain : undefined}
                        className={`${styles.tab} ${isActive ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        aria-disabled={isDisabled || undefined}
                        onClick={(e) => { if (isDisabled) e.preventDefault(); }}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}