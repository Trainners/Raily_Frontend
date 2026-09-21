import {Link, useLocation, useNavigate} from "react-router-dom";
import {getRouteConfig, ROUTES} from "../../../shared/config/routes.ts";
import styles from "./NavBar.module.css"
import {useAppSelector} from "../../../app/store/hooks.ts";
import {selectIsAuthenticated} from "../../../entities/user";
import {useGetUnreadCountQuery} from "../../../entities/notification";

export function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const config = getRouteConfig(location.pathname);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    // 라우트 설정이 허용하고, 로그인이 확인된 뒤에 아이콘을 그림
    const showBell = config.showNotificationButton === true && isAuthenticated;

    // SSE 를 쓸 수 없는 인프라라 30초 폴링으로 배지를 갱신
    // skip: 아이콘을 안 그리는 화면(로그인/회원가입/알림함)과 reissue 대기 중에는 요청 자체를 보내지 않는다.
    const { data } = useGetUnreadCountQuery(undefined, {
        pollingInterval: 30_000,
        skip: !showBell,
    });
    const unread = data?.count ?? 0;

    const handleBack = () => {
        const isFirstEntry = location.key === 'default';
        if (isFirstEntry) {
            navigate(config.backTo ?? ROUTES.JOURNEY_SETUP, { replace: true });
        } else {
            navigate(-1);
        }
    }

    return (
        <header className={styles.bar}>
            <div className={styles.left}>
                {config.showBackButton && (
                    <button type="button" className={styles.back} onClick={handleBack} aria-label="뒤로가기">
                        ‹
                    </button>
                )}
            </div>
            <h1 className={styles.title}>{config.title}</h1>
            <div className={styles.right}>
                {config.rightAction === 'LIVE' && <span className={styles.live}>LIVE</span>}
                {showBell && (
                    <Link
                        to={ROUTES.NOTIFICATIONS}
                        className={styles.bell}
                        aria-label={unread > 0 ? `알림함, 안 읽은 알림 ${unread}개` : '알림함'}
                    >
                        {/* SVG: 기기마다 모양이 달라지지 않고 currentColor 로 색을 맞출 수 있다 */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        {unread > 0 && (
                            <span className={styles.badge} aria-hidden="true">
                                {unread > 99 ? '99+' : unread}
                            </span>
                        )}
                    </Link>
                )}
            </div>
        </header>
    );
}