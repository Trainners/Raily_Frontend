import { TrainRow, type Train } from '../../../entities/train';
import styles from './TrainList.module.css';

export type TrainListProps = {
    trains: Train[];
    onSelectTrain?: (train: Train) => void;
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