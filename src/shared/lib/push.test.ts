import { describe, expect, it } from 'vitest';
import { urlBase64ToUint8Array } from './push';

describe('urlBase64ToUint8Array', () => {
    it('base64url 을 바이트 배열로 변환한다', () => {
        // 'hello' 의 base64url = 'aGVsbG8' (패딩 없음)
        expect(Array.from(urlBase64ToUint8Array('aGVsbG8'))).toEqual([104, 101, 108, 108, 111]);
    });
    it('-, _ 문자를 표준 base64 의 +, / 로 되돌린다', () => {
        // 0xfb 0xff 의 base64 는 '+/8=' → base64url 은 '-_8'
        expect(Array.from(urlBase64ToUint8Array('-_8'))).toEqual([251, 255]);
    });
});