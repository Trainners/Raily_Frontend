import { useLocation, useNavigate } from "react-router-dom";
import type { Train } from "../../../entities/train";
import { Note } from "../../../shared/ui";
import { TrainList } from "../../../widgets/train-list";
import { ROUTES } from "../../../shared/config/routes";

// JourneySetupPage에서 navigate로 넘기는 폼 입력값하고 같은 형태
type JourneySearchState = {
    from: string;
    to: string;
    date: string;
    afterTime: string;
}

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
    const location = useLocation();
    const navigate = useNavigate();

    // JourneySetupPage 안 거치고 바로 들어오면 state 없을 수도 있어서 null 허용
    const searchState = location.state as JourneySearchState | null;

    // state 없을 때는 기존에 하드코딩 했던 기본값으로 대체
    const afterTime = searchState?.afterTime ?? '07:00';

    return (
        <main>
            {/* 이후 별도의 검색 조건 요약 바 컴포넌트로 분리 예정 */}
            <p>{afterTime} 이후 출발 · {trains.length}편</p>

            <TrainList
                trains={trains}
                onSelectTrain={(train) => {
                    // 선택한 열차 정보를 라우터 state로 넘겨서 SeatMatrixPage에서 location.state로 받음
                    navigate(ROUTES.SEAT_MATRIX, {
                        state: train
                    })
                }}
            />

            <Note>
                정차역 정보가 없는 열차는 매트릭스를 만들 수 없어 목록에서 제외됩니다.
            </Note>
        </main>
    )
}