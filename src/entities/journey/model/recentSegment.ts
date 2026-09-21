// 같은 출처(localhost 등)에 다른 앱이 뜨면 키가 섞이므로 접두어를 붙인다
const RECENT_SEGMENT_KEY = 'raily:recent-segment';

export type RecentSegment = {
    from: string;
    to: string;
};

// 마지막으로 조회한 구간을 저장한다
// 사생활 보호 모드나 저장소 차단 설정에서는 접근 자체가 예외를 던지므로 전부 감싼다
export function saveRecentSegment(
    segment: RecentSegment,
): void {
    try {
        const value = JSON.stringify(segment);

        localStorage.setItem(
            RECENT_SEGMENT_KEY,
            value,
        );
    } catch {
        // 최근 구간 저장 실패는 무시
    }
}

// 저장된 최근 구간을 읽는다. 값이 없거나 형태가 맞지 않으면 null
export function getRecentSegment(): RecentSegment | null {
    try {
        const value = localStorage.getItem(
            RECENT_SEGMENT_KEY,
        );

        if (value === null) {
            return null;
        }

        const parsed: unknown = JSON.parse(value);

        // 저장소 값은 서버 응답과 마찬가지로 신뢰할 수 없는 입력이다
        // 예전 형식이나 손댄 값이 들어오면 카드에 'undefined → undefined'가 뜨므로 형태를 직접 확인한다
        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            !('from' in parsed) ||
            !('to' in parsed) ||
            typeof parsed.from !== 'string' ||
            typeof parsed.to !== 'string' ||
            parsed.from.trim() === '' ||
            parsed.to.trim() === ''
        ) {
            return null;
        }

        // 검증한 두 필드만 추려서 돌려준다 (저장소에 남은 다른 키는 버린다)
        return {
            from: parsed.from,
            to: parsed.to,
        };
    } catch {
        // 저장소 접근 실패 또는 JSON 파싱 실패
        return null;
    }
}