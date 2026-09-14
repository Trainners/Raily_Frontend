import {useLocation, useNavigate} from "react-router-dom";
import {ROUTE_CONFIGS} from "../../../shared/config/routes.ts";

export function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const config = ROUTE_CONFIGS[location.pathname] || {
        // 기본값
        title: 'Raily',
        showBackButton: false,
        showTabBar: false,
    };

    return (
        <header>
            <div>
                {config.showBackButton? (
                    <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
                        뒤로가기
                    </button>
                ) : (
                    <span>Raily</span>
                    )}
            </div>
            <h2>{config.title}</h2>
            <div>{config.rightAction === 'LIVE' && (
                <span>LIVE</span>
            )}</div>
        </header>
    )
}