import {Route, Routes} from "react-router-dom"
import LoginPage from "../pages/login/ui/LoginPage.tsx";
import SignupPage from "../pages/signup/ui/SignupPage.tsx";
import {ScreenShell} from "../widgets/screen-shell/ui/ScreenShell.tsx";
import {JourneySetupPage} from "../pages/journey-setup";
import {TrainSelectPage} from "../pages/train-select";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<ScreenShell/>}>
                <Route index element={<LoginPage/>}/>
                <Route path="sign-up" element={<SignupPage/>}/>
                <Route path="journey-setup" element={<JourneySetupPage/>}/>
                <Route path="train-slect" element={<TrainSelectPage/>}/>
            </Route>
        </Routes>
    )
}