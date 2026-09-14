import { formatDuration } from '../../../shared/lib/formatTime';
import type { Train } from '../model/types';
import styles from './TrainRow.module.css'

export type TrainRowProps = {
  train: Train;
  onClick?: () => void;
};

// 열차 선택 페이지에서 각 열차의 출발/도착 정보를 Props로 전달
// format Duration은 shared/lib/formatTime으로 정의
export default function TrainRow({
  train,
  onClick,
}: TrainRowProps) {
  const duration = formatDuration(
    train.departureTime,
    train.arrivalTime
  )

  return (
    <button type="button" className={styles.row} onClick={onClick}>
      <div className={styles.info}>
        <strong className={styles.name}>
          {train.trainName} {train.trainNo}
        </strong>

        <span className={styles.time}>
          {train.departureTime} → {train.arrivalTime} · {duration}
        </span>
      </div>

      <span className={styles.arrow} aria-hidden="true">
        ›
      </span>
    </button>
  );
}