import {Outlet, useLocation} from "react-router-dom";
import {ROUTE_CONFIGS} from "../../../shared/config/routes.ts";
import {NavBar} from "./NavBar.tsx";
import {TabBar} from "./TabBar.tsx"
import styles from "./Screenchell.module.css"

export function ScreenShell() {
    const location = useLocation();
    const config = ROUTE_CONFIGS[location.pathname]
    const showTabBar = config?.showTabBar ?? false;

    return(
        <div className={styles.shell}>
            <NavBar />
            <main className={styles.main}>
                <Outlet />
            </main>
            {showTabBar && <TabBar />}
        </div>
    )
}