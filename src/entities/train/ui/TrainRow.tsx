import type { Train } from '../model/types';

export type TrainRowProps = {
  train: Train;
  onClick?: () => void;
};

export default function TrainRow({
  train,
  onClick,
}: TrainRowProps) {
  return (
    <button type="button" onClick={onClick}>
      <span>{train.trainNo}</span>
      <span>{train.departureTime}</span>
      <span aria-hidden="true">→</span>
      <span>{train.arrivalTime}</span>
    </button>
  );
}