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