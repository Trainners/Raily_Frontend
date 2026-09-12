import type { ReactNode } from 'react';
import styles from './Note.module.css';

export type NoteProps = {
  tone?: 'default' | 'warn' | 'error';
  children: ReactNode;
};

export default function Note({
  tone = 'default',
  children,
}: NoteProps) {
  return (
    <div className={`${styles.note} ${styles[tone]}`}>
      {children}
    </div>
  );
}