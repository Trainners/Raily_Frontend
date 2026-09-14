import {Link, Route, Routes} from "react-router-dom"
import LoginPage from "../pages/login/ui/LoginPage.tsx";
import SignupPage from "../pages/signup/ui/SignupPage.tsx";

export default function App() {
    return (
        <div>
            <Link to='/login'>메인 페이지</Link>

            <main>
                <Routes>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='sign-up' element={<SignupPage/>}/>
                </Routes>
            </main>
        </div>
    )
}