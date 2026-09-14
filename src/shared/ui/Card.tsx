import type { ReactNode } from 'react';
import styles from './Card.module.css';

export type CardProps = {
  label: string;
  value: ReactNode;
};

export default function Card({
    label,
    value
}: CardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.value}>{value}</div>
    </div>
  );
}