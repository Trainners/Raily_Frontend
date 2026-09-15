import { describe, expect, it } from 'vitest';
import type { Seat } from './types';
import { verdictOf, verdictText } from './verdict';

const stops = ['천안', '평택', '오산', '수원', '영등포'];

describe('verdictOf', () => {
  it('전부 free인 좌석은 full을 반환한다', () => {
    const seat: Seat = {
      carNo: 4,
      seatNo: '1A',
      states: ['free', 'free', 'free', 'free']
    }

    expect(verdictOf(seat, stops)).toEqual({
      kind: 'full'
    })
  })

  it('전부 sold인 좌석은 none을 반환한다', () => {
    const seat: Seat = {
      carNo: 4,
      seatNo: '1A',
      states: ['sold', 'sold', 'sold', 'sold']
    }

    expect(verdictOf(seat, stops)).toEqual({
      kind: 'none'
    })
  })

  it('앞은 free이고 뒤는 sold인 좌석은 until을 반환한다', () => {
    const seat: Seat = {
      carNo: 4,
      seatNo: '1A',
      states: ['free', 'free', 'sold', 'sold']
    }

    expect(verdictOf(seat, stops)).toEqual({
      kind: 'until',
      station: '오산'
    })
  })

  it('앞은 sold이고 뒤는 free인 좌석은 from을 반환한다', () => {
    const seat: Seat = {
      carNo: 4,
      seatNo: '1A',
      states: ['sold', 'free', 'free', 'free']
    }

    expect(verdictOf(seat, stops)).toEqual({
      kind: 'from',
      station: '평택'
    })
  })

  it('중간 구간만 sold인 좌석은 partial을 반환한다', () => {
    const seat: Seat = {
      carNo: 4,
      seatNo: '1A',
      states: ['free', 'sold', 'free', 'free']
    }

    expect(verdictOf(seat, stops)).toEqual({
      kind: 'partial',
      soldSegments: [1]
    })
  })
})

describe('verdictText', () => {
  it('full은 하차역까지 이동할 수 있다는 안내 문구를 반환한다', () => {
    expect(
      verdictText({
        kind: 'full'
      })
    ).toBe('하차역까지 비어 있어 중간에 옮기지 않아도 됩니다.')
  })

  it('until은 해당 역까지 앉을 수 있다는 문구를 반환한다', () => {
    expect(
      verdictText({
        kind: 'until',
        station: '오산'
      })
    ).toBe('오산까지 앉고 이동')
  })

  it('from은 해당 역부터 착석 가능하다는 문구를 반환한다', () => {
    expect(
      verdictText({
        kind: 'from',
        station: '평택'
      })
    ).toBe('평택부터 착석 가능')
  })

  it('partial은 일부 구간 이용 가능하다는 문구를 반환한다', () => {
    expect(
      verdictText({
        kind: 'partial',
        soldSegments: [1]
      })
    ).toBe('일부 구간만 착석 가능')
  })

  it('none은 전 구간 판매됨이라는 문구를 반환한다', () => {
    expect(
      verdictText({
        kind: 'none'
      })
    ).toBe('전 구간 판매됨')
  })
})