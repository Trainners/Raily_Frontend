import { Route, Routes} from "react-router-dom"
import LoginPage from "../pages/login/ui/LoginPage.tsx";

export default function App() {
    return (
        <div>
            <p>메인 페이지</p>

            <main>
                <Routes>
                    <Route path='/login' element={<LoginPage/>}/>
                </Routes>
            </main>
        </div>
    )
}