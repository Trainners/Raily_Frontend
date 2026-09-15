import {Outlet, useLocation} from "react-router-dom";
import {ROUTE_CONFIGS} from "../../../shared/config/routes.ts";
import {NavBar} from "./NavBar.tsx";
import {TabBar} from "./TabBar.tsx"

export function ScreenShell() {
    const location = useLocation();
    const config = ROUTE_CONFIGS[location.pathname]
    const showTabBar = config?.showTabBar ?? false;

    return(
        <div>
            <NavBar/>
            <main>
                {/*라우트에 매칭된 실제 페이지의 렌더링 위치*/}
                <Outlet/>
            </main>
            {showTabBar && <TabBar/>}
        </div>
    )
}