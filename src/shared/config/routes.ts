// 라우트 메타데이터 타입 정의
export interface RouteHandle {
    title:string;
    showBackButton?: boolean;
    showTabBar?:boolean;
    // 헤더 영역 혹은 네비게이션 바 영역에 노출할 버튼 및 인티케이터의 종류를 라우트별로 정의하기 위한 규격
    rightAction?: 'REFRESH' | 'LIVE' | 'NONE';
}
