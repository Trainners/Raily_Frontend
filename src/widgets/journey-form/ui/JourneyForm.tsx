import { useState } from 'react';
import { Button, Card, DateSelect, TimeSelect } from '../../../shared/ui';
import styles from './JourneyForm.module.css';
import { STATIONS } from '../../../entities/station';
import { StationCombobox } from '../../../features/pick-station';

export type JourneyFormProps = {
  recentSegment?: {   // 최근 조회했던 출발-도착 구간, 있으면 '이 구간으로 채우기' 카드 표시
    from: string;
    to: string;
  }
  onSubmit: (values: {  // '열차 조회' 버튼 클릭 시 폼에 입력된 값 전체를 JourneySetupPage로 전달
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

      <StationCombobox
        label="출발역"
        value={from}
        placeholder="출발역을 선택하세요"
        stops={STATIONS}
        onSelect={setFrom}
      />

      <StationCombobox
        label="도착역"
        value={to}
        placeholder="도착역을 선택하세요"
        stops={STATIONS}
        onSelect={setTo}
      />

      <DateSelect
        label="날짜"
        value={date}
        onChange={setDate}
      />

      <TimeSelect
        label="이 시각 이후"
        value={afterTime}
        onChange={setAfterTime}
      />

      <Button fullWidth onClick={handleSubmit}>
        열차 조회
      </Button>
    </div>
  )
}