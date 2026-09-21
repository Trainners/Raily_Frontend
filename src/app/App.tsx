import {Navigate, Route, Routes} from "react-router-dom"

import {ROUTES} from "../shared/config/routes.ts";
import {ScreenShell} from "../widgets/screen-shell";
import {LoginPage} from "../pages/login";
import {JourneySetupPage} from "../pages/journey-setup";
import {TrainSelectPage} from "../pages/train-select";
import {SeatMatrixPage} from "../pages/seat-matrix";
import {SignUpPage} from "../pages/signup";
import { SettingsPage } from "../pages/settings";
import {RedirectIfAuthenticated, RequireAuth} from "./router";
import {ServiceWorkerBridge} from "./providers";

export default function App() {
    return (
        <>
            <ServiceWorkerBridge/>
            <Routes>
                {/*모든 화면의 공통 껍데기*/}
                <Route element={<ScreenShell />}>
                    {/*공개화면 : 이미 로그인 되어있는 상태라면 여정 검색 화면으로 강제 라우팅*/}
                    <Route element={<RedirectIfAuthenticated/>}>
                        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
                    </Route>
                    {/*보호 화면 : 비로그인이면 로그인 화면으로 강제 라우팅*/}
                    <Route element={<RequireAuth/>}>
                        <Route path={ROUTES.JOURNEY_SETUP} element={<JourneySetupPage />} />
                        <Route path={ROUTES.TRAIN_SELECT} element={<TrainSelectPage />} />
                        <Route path={ROUTES.SEAT_MATRIX} element={<SeatMatrixPage />} />
                        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    </Route>
                    {/*정의되지 않은 경로 : 여정 검색으로 보내고, 로그인 여부는 RequireAuth가 판단*/}
                    <Route path="*" element={<Navigate to={ROUTES.JOURNEY_SETUP} replace />} />
                </Route>
            </Routes>
        </>
    )
}
