import { useState } from 'react';
import { Button, Card, Select } from '../../../shared/ui';
import styles from './JourneyForm.module.css';

export type JourneyFormProps = {
  recentSegment?: {
    from: string;
    to: string;
  }
  onSubmit: (values: {
    from: string;
    to: string;
    date: string;
    afterTime: string;
  }) => void;
};

export default function JourneyForm({
  recentSegment,
  onSubmit,
}: JourneyFormProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [afterTime, setAfterTime] = useState('');

  const handleSubmit = () => {
    onSubmit({
      from,
      to,
      date,
      afterTime,
    });
  };

  const handleFillRecentSegment = () => {
    if (!recentSegment) return;

    setFrom(recentSegment.from);
    setTo(recentSegment.to);
  };

  return (
    <div className={styles.form}>
      {recentSegment && (
        <Card
          label="최근 구간"
          value={
            <div className={styles.recentContent}>
              <span>
                {recentSegment.from} → {recentSegment.to}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleFillRecentSegment}
              >
                이 구간으로 채우기
              </Button>
            </div>
          }
        />
      )}

      <Select
        label="출발역"
        value={from}
        placeholder="출발역을 선택하세요"
        onOpen={() => setFrom('천안')}
      />

      <Select
        label="도착역"
        value={to}
        placeholder="도착역을 선택하세요"
        onOpen={() => setTo('영등포')}
      />

      <Select
        label="날짜"
        value={date}
        placeholder="날짜를 선택하세요"
        onOpen={() => setDate('2026-09-11 (금)')}
      />

      <Select
        label="이 시각 이후"
        value={afterTime}
        placeholder="출발 시각을 선택하세요"
        onOpen={() => setAfterTime('07:00')}
      />

      <Button fullWidth onClick={handleSubmit}>
        열차 조회
      </Button>
    </div>
  )
}