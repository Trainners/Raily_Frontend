import {
    type BaseQueryApi,
    type BaseQueryFn,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError
} from "@reduxjs/toolkit/query";
import {sessionExpired, tokenReissued} from "./authEvents.ts";

// type로 필요한 state모양만 구조적으로 선언하여 사용
// userSlice에 accessToken이 있다는 모양만 선언
type StateWithAuth = {user : {accessToken: string | null}};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: '/api',
    // refresh 토큰 쿠키를 요청에 자동 첨부하기 위한 옵션.
    // 지금은 프록시(vite / vercel rewrite) 덕분에 같은 출처라 기본값(same-origin)과 동작이 같지만,
    // 나중에 백엔드를 직접 호출(다른 출처)하게 돼도 쿠키가 빠지지 않도록 명시함.
    credentials: 'include',

    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as StateWithAuth).user.accessToken;
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
})

// 재인증을 시도하면 안되는 경로들(이 경로들 외에는 엑세스 토큰이 만료되어 요청 응답으로 403혹은 401응답을 반환받을 시 refreshToken으로 accessToken을 재발급 받아 재요청함)
const NO_REAUTH_PATHS = ['/auth/login', '/auth/reissue', '/users/signup'];

const getUrl = (args: string | FetchArgs) => (typeof args === 'string' ? args : args.url);

// 401과 403응답을 인증 에러(토큰 만료)로 취급
const isAuthError = (error?: FetchBaseQueryError) =>
    error?.status === 401 || error?.status === 403;

// reissue 진행중 403응답 도착시 Promise를 공유하게 하여 reissue 반복 방지
let reissueInFlight: Promise<string | null> | null = null;

function reissueAccessToken(api: BaseQueryApi, extraOptions: object) : Promise<string | null> {
    if (!reissueInFlight) {
        reissueInFlight = Promise.resolve(rawBaseQuery({url: '/auth/reissue', method: 'POST'}, api, extraOptions))
            .then((response) => {
                const token = (response.data as { accessToken?: string} | undefined)?.accessToken;
                if (response.error || !token) {
                    // 400(쿠키없음), 500(무효)/ 네트워크 오류 => 세션만료
                    api.dispatch(sessionExpired());
                    return null;
                }
                // userSlice의 extraReducer가 accessToken을 갱신
                api.dispatch(tokenReissued(token));
                return token;
            })
            .finally(() => {
                reissueInFlight = null;
            });
    }
    return reissueInFlight;
}

// 401/403이면 reissue 1회 후 원래 요청을 재시도하도록 wrapper형태로 감싸도록 설계
// 실패시 어떻게할지를 담당
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        const result = await rawBaseQuery(args, api, extraOptions);

        if (!isAuthError(result.error) || NO_REAUTH_PATHS.includes(getUrl(args))) {
            return result;
        }

        const token = await reissueAccessToken(api, extraOptions);
        if (!token) {
            // 재발급 실패 → 원래 에러를 그대로 돌려줌 (호출자의 isError 유지)
            return result;
        }

        // prepareHeaders가 스토어에서 새 토큰을 읽으므로 그대로 다시 실행하면 된다
        return rawBaseQuery(args, api, extraOptions);
    };
