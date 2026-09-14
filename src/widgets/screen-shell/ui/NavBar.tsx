import {useMatches, useNavigate} from "react-router-dom";
import type {RouteHandle} from "../../../shared/config/routes.ts";

export function NavBar() {
    const matches = useMatches();
    const navigate = useNavigate();

    // 가장 최근에 매칭된 자식 라우트의 메타 데이터 추출
    const currentMatch = matches[matches.length - 1];
    //routes.ts에 선언한 타입으로 라우트 제목, 버튼 상태 관리=
    const handle = (currentMatch?.handle as RouteHandle) || {
        title: 'Raily',
        showBackButton: false,
    };

    return (
        <header>
            {handle.showBackButton ? (
                // 이항 연산자를 통해
                <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">back</button>
            ):(
                <span>Raily</span>
            )}
            <h2>{handle.title}</h2>
            <div>
                {handle.rightAction === 'LIVE' && <span>LIVE</span>}
            </div>
        </header>
    )
}