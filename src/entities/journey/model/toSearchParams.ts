import type { TrainSearchParams } from '../../train/model/types';
import type { JourneySearch } from './types';

/*
JourneySearch를 열차 조회 API 요청 파라미터로 변환한다.

백엔드가 date/time을 yyyyMMdd/HHmmss 숫자 형식으로 받아서
화면 표시용 문자열에서 숫자만 뽑아 변환한다.
시각은 6자리여야 하고, 4자리로 보내면 요청 시각 이전 열차까지 조회된다.
*/
export function toSearchParams(
    journeySearch: JourneySearch,
): TrainSearchParams {
    return {
        departureStation: journeySearch.from,
        arrivalStation: journeySearch.to,
        date: journeySearch.date.replace(/[^0-9]/g, ''),
        time: journeySearch.afterTime.replace(/[^0-9]/g, '') + '00',
    }
}