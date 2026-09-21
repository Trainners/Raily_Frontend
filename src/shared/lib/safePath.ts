// RequireAuth 가 로그인 화면으로 보낼 때 router state 에 싣는 모양
export type LoginRedirectState = { from?: string };

// 앱 내부 경로("/..." 로 시작하는 같은 출처 상대경로)만 통과시키고, 아니면 fallback 을 돌려준다.
export function toSafeInternalPath(value: unknown, fallback: string): string {
    if (typeof value !== 'string') return fallback;
    // "//evil.com", "/\evil.com" 은 브라우저가 다른 호스트로 해석한다 → 오픈 리다이렉트
    if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
    return value;
}

// 로그인 후 어디로 보낼지. RedirectIfAuthenticated 와 LoginPage 가 반드시 이 함수 하나를 같이 쓴다.
export function resolvePostLoginPath(state: unknown, fallback: string): string {
    const from = (state as LoginRedirectState | null)?.from;
    return toSafeInternalPath(from, fallback);
}