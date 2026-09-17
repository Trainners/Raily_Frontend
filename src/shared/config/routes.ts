// 라우트 메타데이터 타입 정의
export interface RouteConfig {
    // 라우트 할 페이지 이름
    title: string;
    // 뒤로가기 버튼 표기 상태
    showBackButton: boolean;
    // 하단 탭바 표기 상태
    showTabBar: boolean;
    rightAction?: 'LIVE' | 'REFRESH' | 'NONE';
}

export const ROUTES = {
    LOGIN: '/',
    SIGNUP: '/sign-up',
    JOURNEY_SETUP: '/journey-setup',
    TRAIN_SELECT: '/train-select',
    SEAT_MATRIX: '/seat-matrix',
    SETTINGS: '/settings',
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
    },
    [ROUTES.JOURNEY_SETUP]: {
        title: '여정 검색',
        showBackButton: false,
        showTabBar: true,
    },
    [ROUTES.TRAIN_SELECT]: {
        title: '열차 선택',
        showBackButton: true,
        showTabBar: true,
    },
    [ROUTES.SEAT_MATRIX]: {
        title: '구간 빈자리 현황',
        showBackButton: true,
        showTabBar: false,
        rightAction: 'LIVE',
    },
    [ROUTES.SETTINGS]: {
        title: '설정',
        showBackButton: false,
        showTabBar: true,
    }
};
