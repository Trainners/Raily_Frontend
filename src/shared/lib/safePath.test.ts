import { describe, expect, it } from 'vitest';
import { resolvePostLoginPath, toSafeInternalPath } from './safePath';

describe('toSafeInternalPath', () => {
    it('내부 경로는 쿼리까지 그대로 통과시킨다', () => {
        expect(toSafeInternalPath('/notifications?highlight=12', '/home')).toBe('/notifications?highlight=12');
    });
    it('외부 URL 과 프로토콜 상대 URL 은 fallback 으로 바꾼다', () => {
        expect(toSafeInternalPath('https://evil.com', '/home')).toBe('/home');
        expect(toSafeInternalPath('//evil.com', '/home')).toBe('/home');
        expect(toSafeInternalPath('/\\evil.com', '/home')).toBe('/home');
    });
    it('문자열이 아니면 fallback', () => {
        expect(toSafeInternalPath(undefined, '/home')).toBe('/home');
        expect(toSafeInternalPath({ pathname: '/x' }, '/home')).toBe('/home');
    });
});

describe('resolvePostLoginPath', () => {
    it('state 가 없으면 fallback', () => {
        expect(resolvePostLoginPath(null, '/home')).toBe('/home');
    });
    it('state.from 이 내부 경로면 그 경로', () => {
        expect(resolvePostLoginPath({ from: '/settings' }, '/home')).toBe('/settings');
    });
});