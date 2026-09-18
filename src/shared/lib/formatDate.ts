/*
날짜 표시 형식 변환

입력 예시: '2026-09-18'
출력 예시: '2026. 09. 18 (금)'
*/
export function formatDisplayDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return `${year}. ${month}. ${day} (${weekday})`;
}