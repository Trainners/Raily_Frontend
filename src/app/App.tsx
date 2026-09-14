import {Route, Routes} from "react-router-dom"
import SignupPage from "../pages/signup/ui/SignupPage.tsx";
import {ScreenShell} from "../widgets/screen-shell/ui/ScreenShell.tsx";
import {LoginPage} from "../pages/login/ui/LoginPage.tsx";

export default function App() {
    return (
        <div>
            <main>
                <Routes>
                    <Route path="/" element={<ScreenShell/>}>
                        <Route index element={<LoginPage/>}/>
                        <Route path="sign-up" element={<SignupPage/>}/>
                    </Route>

                </Routes>
            </main>
        </div>
    )
}