import {selectAuthStatus} from "../../entities/user";
import {useAppSelector} from "../store/hooks.ts";
import {LoadingScreen} from "../../shared/ui";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {ROUTES} from "../../shared/config/routes.ts";
import type {LoginRedirectState} from "../../shared/lib/safePath.ts";

// 인증이 필요한 경로의 화면을 감싸는 레이아웃 라우트 정의
// 이 라우트의 자식 라우트들이 Outlet 자리에 렌더되도록 감쌈
export function RequireAuth() {
    const status = useAppSelector(selectAuthStatus);

    const location = useLocation();

    // 첫 진입 후 reissue 응답을 대기중인 상태일 때 -> 아직 로그인 되는지 모르므로 대기중 상태 표현
    if (status === 'restoring') {
        return <LoadingScreen message="로그인 정보를 확인하는 중..."/>;
    }
    // reissue 결과 비로그인 상태 확인되면 -> 로그인 화면으로 강제 라우팅 ( 뒤로가기를 통해 이 보호 화면에 진입하지 못하도록)
    if (status === 'anonymous') {
        // 로그인 후 돌아올 곳 -> search 까지 붙여야 highligth=12가 유지
        const redirectState: LoginRedirectState = {from: `${location.pathname}${location.search}`};
        return <Navigate to={ROUTES.LOGIN} replace state={redirectState}/>
    }
    // reissue 결과 authenticated 상태가 확인되면 자식 화면을 렌더
    return <Outlet/>
}