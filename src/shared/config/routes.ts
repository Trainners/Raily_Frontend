// 라우트 메타데이터 타입 정의
export interface RouteConfig {
    // 라우트 할 페이지 이름
    title: string;
    // 뒤로가기 버튼 표기 상태
    showBackButton: boolean;
    // 하단 탭바 표기 상태
    showTabBar: boolean;
    rightAction?: 'LIVE' | 'REFRESH' | 'NONE';
    // 앱 내 히스토리가 없을 경우 뒤로가기가 갈 페이지 지정
    backTo?: string;
    // NavBar 우측 코너에 알림함(종 아이콘) 버튼을 띄울지 여부
    showNotificationButton?: boolean;
}

// 매칭되는 설정이 없을 때(정의되지 않은 경로)의 기본값
const DEFAULT_ROUTE_CONFIG: RouteConfig = {title: 'Raily', showBackButton: false, showTabBar: false};


export const ROUTES = {
    LOGIN: '/',
    SIGNUP: '/sign-up',
    JOURNEY_SETUP: '/journey-setup',
    TRAIN_SELECT: '/train-select',
    SEAT_MATRIX: '/seat-matrix',
    SETTINGS: '/settings',
    NOTIFICATIONS: '/notifications',
} as const;

export const ROUTE_CONFIGS: Record<string, RouteConfig> = {
    [ROUTES.LOGIN]: {
        title: 'Raily 로그인',
        showBackButton: false,
        showTabBar: false,
    },
    [ROUTES.SIGNUP]: {
        title: '회원가입',
        showBackButton: true,
        showTabBar: false,
        backTo: ROUTES.LOGIN,
    },
    [ROUTES.JOURNEY_SETUP]: {
        title: '여정 검색',
        showBackButton: false,
        showTabBar: true,
        showNotificationButton: true,
    },
    [ROUTES.TRAIN_SELECT]: {
        title: '열차 선택',
        showBackButton: true,
        showTabBar: true,
        backTo: ROUTES.JOURNEY_SETUP,
        showNotificationButton: true,
    },
    [ROUTES.SEAT_MATRIX]: {
        title: '구간 빈자리 현황',
        showBackButton: true,
        showTabBar: false,
        rightAction: 'LIVE',
        backTo: ROUTES.TRAIN_SELECT,
        showNotificationButton: true,
    },
    [ROUTES.SETTINGS]: {
        title: '설정',
        showBackButton: false,
        showTabBar: true,
        showNotificationButton: true,
    },
    // 탭이 아니라 NavBar 종 아이콘으로 들어오는 하위 화면인 알림함
    // 푸시 클릭으로 바로 열려 앱 내 히스토리가 없으면 backTo 로 돌아간다
    [ROUTES.NOTIFICATIONS]: {
        title: '알림',
        showBackButton: true,
        showTabBar: false,
        backTo: ROUTES.JOURNEY_SETUP,
    },
};

// NavBar와 ScreenShell이 각자 fallback을 갖던 것을 한곳으로 모음
export const getRouteConfig = (pathname: string) : RouteConfig =>
    ROUTE_CONFIGS[pathname] ?? DEFAULT_ROUTE_CONFIG;