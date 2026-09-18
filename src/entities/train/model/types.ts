export type Train = {
    // 열차는 열차 종류, 열차 번호로 구분되므로 열차 이름(종류), 열차 번호를 나누어 저장 ex) trainName: ITX - 새마을, trainNo: 1223
    trainName: string;
    trainNo: string;
    departureTime: string;
    arrivalTime: string;
};

// 백엔드 TrainListResponse하고 1:1로 응답 맞추기
export type TrainApiResponse = {
    trainNum: string;
    trainTypeName: string;
    departureTime: string;
    arrivalTime: string;
    expectedDelay: string;
};

// GET /api/trains 검색 조건
export type TrainSearchParams = {
    departureStation: string;
    arrivalStation: string;
    date: string;
    time: string;
}