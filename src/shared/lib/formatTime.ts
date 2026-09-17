/*
백엔드 시각 형식을 화면 시각 형식으로 변환

입력:
- 'HHmmss' 형식의 6자리 문자열
- 예: '070100'

반환:
- 'HH:mm' 형식의 문자열
- 예: '07:01'

초 단위는 화면에서 사용하지 않으므로 제외
*/

export function formatApiTime(time: string): string {
    const hour = time.slice(0, 2);
    const minute = time.slice(2, 4);

    return `${hour}:${minute}`;
}

/*
시작 시간과 종료 시간 기준으로 소요 시간 계산

입력:
- start: 'HH:mm' 형식
- end: 'HH:mm' 형식

반환:
- 1시간 미만: '30분'
- 정각 단위: '2시간'
- 시간 + 분: '2시간 15분'

24시간제 기준, 종료 시간이 시작 시간보다 이전인 경우 자정을 넘기는 시간은 처리 안 함
*/

export function formatDuration(start: string, end: string): string {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const duration = endTotalMinutes - startTotalMinutes;

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours === 0) {
        return `${minutes}분`;
    }

    if (minutes === 0) {
        return `${hours}시간`;
    }

    return `${hours}시간 ${minutes}분`;
}