import {NavLink} from "react-router-dom";
import {ROUTES} from "../../../shared/config/routes.ts";

export function TabBar() {

    return(
        <nav aria-label="하단 네비게이션바">
            <NavLink to={ROUTES.JOURNEY_SETUP}>
                홈
            </NavLink>
            <NavLink to={ROUTES.SEAT_MATRIX}>
                내 여정
            </NavLink>
        </nav>
    )
}