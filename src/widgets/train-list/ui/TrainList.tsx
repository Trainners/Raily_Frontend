import { TrainRow, type Train } from '../../../entities/train';
import styles from './TrainList.module.css';

export type TrainListProps = {
    trains: Train[];    // 렌더링 할 열차 목록 데이터
    onSelectTrain?: (train: Train) => void;     // 사용자가 목록에서 열차 하나 선택했을 때 부모 페이지에 알려주는 콜백
};

export default function TrainList({
    trains,
    onSelectTrain,
}: TrainListProps) {
    if (trains.length === 0) {
        return (
            <div className={styles.empty}>
                운행 중인 열차가 없습니다.
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {trains.map((train) => (
                <TrainRow
                    key={train.trainNo}
                    train={train}
                    onClick={() => onSelectTrain?.(train)}
                />
            ))}
        </div>
    );
}