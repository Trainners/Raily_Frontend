import type { Seat } from './types';

export type Verdict =
    | { kind: 'full' }                              // 표시된 구간 전체가 비어있음
    | { kind: 'until'; station: string }            // 어디까지만 앉을 수 있음
    | { kind: 'from'; station: string }             // 어디부터 앉을 수 있음
    | { kind: 'partial'; soldSegments: number[] }   // 중간 구간 판매됨
    | { kind: 'none' }                              // 전 구간 판매됨

export function verdictOf(seat: Seat, stops: string[]): Verdict {
    const { states } = seat;

    // 전부 비어 있음
    if (states.every((state) => state === 'free')) {
        return { kind: 'full' }
    }

    // 전부 판매됨
    if (states.every((state) => state === 'sold')) {
        return { kind: 'none' }
    }

    // free -> sold 형태인지 확인
    const firstSoldIndex = states.findIndex((state) => state === 'sold');

    const isUntilPattern =
        firstSoldIndex > 0 &&
        states
            .slice(0, firstSoldIndex)
            .every((state) => state === 'free') &&
        states
            .slice(firstSoldIndex)
            .every((state) => state === 'sold');

    if (isUntilPattern) {
        return {
            kind: 'until',
            station: stops[firstSoldIndex]
        }
    }

    // sold -> free 형태인지 확인
    const firstFreeIndex = states.findIndex((state) => state === 'free');

    const isFromPattern =
        firstFreeIndex > 0 &&
        states
            .slice(0, firstFreeIndex)
            .every((state) => state === 'sold') &&
        states
            .slice(firstFreeIndex)
            .every((state) => state === 'free');

    if (isFromPattern) {
        return {
            kind: 'from',
            station: stops[firstFreeIndex]
        }
    }

    // 중간 구간 판매됨
    return {
        kind: 'partial',
        soldSegments: states.reduce<number[]>((segments, state, index) => {
            if (state === 'sold') {
                segments.push(index)
            }
            return segments
        }, [])
    }
}

export function verdictText(v: Verdict): string {
    switch (v.kind) {
        case 'full':
            return '하차역까지 비어 있어 중간에 옮기지 않아도 됩니다.';

        case 'until':
            return `${v.station}까지 앉고 이동`;

        case 'from':
            return `${v.station}부터 착석 가능`;

        case 'partial':
            return '일부 구간만 착석 가능';

        case 'none':
            return '전 구간 판매됨';
    }
}