import type { SeatState } from '../model/types';
import styles from './SeatCell.module.css';

export type SeatCellProps = {
  state: SeatState;
};

const stateText: Record<SeatState, string> = {
  free: '빈',
  sold: '판매',
  mine: '내',
};

export default function SeatCell({ state }: SeatCellProps) {
  return (
    <span className={`${styles.cell} ${styles[state]}`}>
      {stateText[state]}
    </span>
  );
}