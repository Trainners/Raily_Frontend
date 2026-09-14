import {Route, Routes} from "react-router-dom"
import LoginPage from "../pages/login/ui/LoginPage.tsx";
import SignupPage from "../pages/signup/ui/SignupPage.tsx";
import {ScreenShell} from "../widgets/screen-shell/ui/ScreenShell.tsx";
import {JourneySetupPage} from "../pages/journey-setup";
import {TrainSelectPage} from "../pages/train-select";
import SeatMatrixPage from "../pages/seat-matrix/ui/SeatMatrixPage.tsx";
import {ROUTES} from "../shared/config/routes.ts";

export default function App() {
    return (
        <Routes>
            <Route element={<ScreenShell />}>
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                <Route path={ROUTES.JOURNEY_SETUP} element={<JourneySetupPage />} />
                <Route path={ROUTES.TRAIN_SELECT} element={<TrainSelectPage />} />
                <Route path={ROUTES.SEAT_MATRIX} element={<SeatMatrixPage />} />
            </Route>
        </Routes>
    )
}