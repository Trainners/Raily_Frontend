import type { Seat, SeatsApiResponse } from './types';

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

/*
전체 응답을 Seat[] 형태로 변환한다.

stops 예시:
['천안', '평택', '수원', '영등포']

states 예시:
['free', 'sold', 'free']
*/
export function toSeats(
    response: SeatsApiResponse,
    stops: string[],
): Seat[] {
    const segmentKeys = stops
        .slice(0, -1)
        .map(
            (from, index) => `${from}-${stops[index + 1]}`
        )

    // 모든 구간에 등장하는 호차 모으기
    const carNumbers = new Set<string>()

    segmentKeys.forEach((segmentKey) => {
        const carInfos = response[segmentKey]

        if (!carInfos) return

        Object.keys(carInfos).forEach((carNo) => {
            carNumbers.add(carNo)
        })
    })

    // 호차 번호순으로 정렬, 문자열로 되어 있어서 숫자로 변환해서 비교
    const sortedCarNumbers = Array.from(carNumbers).sort(
        (a, b) => Number(a) - Number(b)
    )

    // 구간 + 호차별로
    // 좌석 번호 -> 판매 가능 여부 미리 만들기
    const seatInfoMap = new Map<
        string,
        Map<string, 'Y' | 'N'>
    >()

    segmentKeys.forEach((segmentKey) => {
        const carInfos = response[segmentKey]

        if (!carInfos) return

        Object.entries(carInfos).forEach(([carNo, carInfo]) => {
            const seatMap = new Map<string, 'Y' | 'N'>()

            carInfo.seat_infos.seat_info.forEach(
                (seatInfo) => {
                    seatMap.set(
                        seatInfo.h_con_seat_no,
                        seatInfo.h_sale_psb_flg,
                    )
                }
            )

            seatInfoMap.set(
                `${segmentKey}-${carNo}`,
                seatMap,
            )
        })
    })

    const seats: Seat[] = []

    // 호차별 좌석 번호는 해당 호차가 처음 등장한 구간의 seat_info를 기준으로
    sortedCarNumbers.forEach((carNo) => {
        let seatNumbers: string[] = []

        for (const segmentKey of segmentKeys) {
            const carInfo = response[segmentKey]?.[carNo]

            if (!carInfo) continue
            
            seatNumbers = carInfo.seat_infos.seat_info.map(
                (seatInfo) => seatInfo.h_con_seat_no
            )

            break
        }

        seatNumbers.forEach((seatNo) => {
            const states = segmentKeys.map((segmentKey) => {
                const seatMap = seatInfoMap.get(
                    `${segmentKey}-${carNo}`
                )

                // 해당 구간에 호차 자체가 없으면 전석 매진으로 간주
                if (!seatMap) {
                    return 'sold' as const
                }

                const saleFlag = seatMap.get(seatNo)

                return saleFlag === 'Y' ? 'free' : 'sold'
            })

            seats.push({
                carNo: Number(carNo),
                seatNo,
                states,
            })
        })
    })

    return seats
}