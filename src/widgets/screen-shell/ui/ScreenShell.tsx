import {Outlet, useLocation} from "react-router-dom";
import {getRouteConfig} from "../../../shared/config/routes.ts";
import {NavBar} from "./NavBar.tsx";
import {TabBar} from "./TabBar.tsx"
import styles from "./ScreenShell.module.css"

export function ScreenShell() {

    const { pathname } = useLocation();
    const { showTabBar } = getRouteConfig(pathname);

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