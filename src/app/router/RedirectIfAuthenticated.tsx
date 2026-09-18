import {useAppSelector} from "../store/hooks.ts";
import {selectAuthStatus} from "../../entities/user";
import {LoadingScreen} from "../../shared/ui";
import {Navigate, Outlet} from "react-router-dom";
import {ROUTES} from "../../shared/config/routes.ts";

// 로그인,회원가입처럼 이미 로그인 했으면 볼 필요 없는 화면들을 감싼다
export function RedirectIfAuthenticated() {
    const status = useAppSelector(selectAuthStatus);

    // 로그인 상태 복원 전에 로그인폼을 노출하지 않도록 로딩 스크린을노출
    // 폼이 먼저 보이면 reissue 응답이 늦을 경우 먼저 로그인에 성공되는 경우가 생길 수 있고, 뒤늦게 온 reissue 실패가 로그인 성공을 덮어쓸수 있음
    if (status === 'restoring') {
        return <LoadingScreen message="상태를 확인중..."/>;
    }

    // 로그인 되어있는 상태라면 앱의 첫 화면인 여정 조회 화면으로
    if (status === 'authenticated') {
        // 보호 라우트는 브라우저의 히스토리에 남게 하지 않도록 replace 옵션 사용
        return <Navigate to={ROUTES.JOURNEY_SETUP} replace/>;
    }

    // 'anonymous' 상태면 로그인/회원가입 폼 렌더
    return <Outlet/>
}