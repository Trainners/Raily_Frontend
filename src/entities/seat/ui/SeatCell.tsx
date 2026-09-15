import type { SeatState } from '../model/types';
import styles from './SeatCell.module.css';

export type SeatCellProps = {
  state: SeatState;
  onClick?: () => void;
};

const stateText: Record<SeatState, string> = {
  free: '빈',
  sold: '판매',
  mine: '내',
};

export default function SeatCell({ state, onClick }: SeatCellProps) {
  return (
    // 좌석 클릭으로 상세 시트를 열어야 해서 span 대신 button 사용
    <button
      className={`${styles.cell} ${styles[state]}`}
      type="button"
      onClick={onClick}
    >
      {stateText[state]}
    </button>
  );
}