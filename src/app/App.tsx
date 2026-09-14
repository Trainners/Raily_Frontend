import {Route, Routes} from "react-router-dom"

import {ROUTES} from "../shared/config/routes.ts";
import {ScreenShell} from "../widgets/screen-shell";
import {LoginPage} from "../pages/login";
import SignupPage from "../pages/signup/ui/SignupPage.tsx";
import {JourneySetupPage} from "../pages/journey-setup";
import {TrainSelectPage} from "../pages/train-select";
import {SeatMatrixPage} from "../pages/seat-matrix";

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