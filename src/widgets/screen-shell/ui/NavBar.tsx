import {useLocation, useNavigate} from "react-router-dom";
import {getRouteConfig, ROUTES} from "../../../shared/config/routes.ts";
import styles from "./NavBar.module.css"

export function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const config = getRouteConfig(location.pathname);

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
            <div className={styles.side}>
                {config.showBackButton && (
                    <button type="button" className={styles.back} onClick={handleBack} aria-label="뒤로가기">
                        ‹
                    </button>
                )}
            </div>
            <h1 className={styles.title}>{config.title}</h1>
            <div className={styles.side}>
                {config.rightAction === 'LIVE' && <span className={styles.live}>LIVE</span>}
            </div>
        </header>
    );
}