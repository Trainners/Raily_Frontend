import type { Train } from "../../../entities/train";
import { Note } from "../../../shared/ui";
import { TrainList } from "../../../widgets/train-list";

const mockTrains: Train[] = [
    {
        trainName: 'ITX-새마을',
        trainNo: '1202',
        departureTime: '07:10',
        arrivalTime: '09:45'
    },
    {
        trainName: '무궁화호',
        trainNo: '1208',
        departureTime: '07:35',
        arrivalTime: '10:20'
    },
    {
        trainName: 'ITX-새마을',
        trainNo: '1210',
        departureTime: '08:00',
        arrivalTime: '10:35'
    },
    {
        trainName: '무궁화호',
        trainNo: '1212',
        departureTime: '08:30',
        arrivalTime: '11:15'
    },
    {
        trainName: 'ITX-새마을',
        trainNo: '1214',
        departureTime: '09:00',
        arrivalTime: '11:35'
    },
];

export default function TrainSelectPage() {
    const trains = mockTrains;

    return (
        <main>
            {/* 이후 별도의 검색 조건 요약 바 컴포넌트로 분리 예정 */}
            <p>07:00 이후 출발 · {trains.length}편</p>

            <TrainList
                trains={trains}
                onSelectTrain={(train) => console.log(train)}
            />

            <Note>
                정차역 정보가 없는 열차는 매트릭스를 만들 수 없어 목록에서 제외됩니다.
            </Note>
        </main>
    )
}