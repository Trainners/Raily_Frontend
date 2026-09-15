import type { ReactNode } from 'react';
import styles from './Card.module.css';

export type CardProps = {
  label: string;
  value: ReactNode;
  tone?: 'neutral' | 'mine';    // 'mine'이면 내 좌석 강조용 배경색 + 점으로 렌더링
};

export default function Card({
  label,
  value,
  tone = 'neutral'
}: CardProps) {
  return (
    <div className={`${styles.card} ${styles[tone]}`}>
      <span className={styles.label}>
        {tone === 'mine' && <span className={styles.dot} />}
        {label}
      </span>

      <span className={styles.value}>{value}</span>
    </div>
  );
}