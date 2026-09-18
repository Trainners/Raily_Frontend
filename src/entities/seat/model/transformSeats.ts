/*
구간 키 배열과 출발역을 기준으로
정차역의 순서를 계산한다.

입력 예시:
['수원-영등포', '평택-수원', '천안-평택']
출발역:
'천안'

출력:
['천안', '평택', '수원', '영등포']
*/
export function resolveStops(
    segmentKeys: string[],
    departureStation: string,
): string[] {
    const nextStationMap = new Map<string, string>()

    segmentKeys.forEach((segmentKey) => {
        const [from, to] = segmentKey.split('-')

        nextStationMap.set(from, to)
    })

    const stops: string[] = [departureStation]

    let currentStation = departureStation

    while (nextStationMap.has(currentStation)) {
        const nextStation = nextStationMap.get(currentStation)!

        stops.push(nextStation)
        currentStation = nextStation
    }

    return stops
}