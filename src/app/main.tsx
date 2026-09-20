import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './styles/global.css'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store/store.ts";
import {AuthBootstrap} from "./providers";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <AuthBootstrap>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthBootstrap>
    </Provider>

)