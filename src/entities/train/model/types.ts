export type Train = {
    // 열차는 열차 종류, 열차 번호로 구분되므로 열차 이름(종류), 열차 번호를 나누어 저장 ex) trainName: ITX - 새마을, trainNo: 1223
    trainName: string;
    trainNo: string;
    departureTime: string;
    arrivalTime: string;
};