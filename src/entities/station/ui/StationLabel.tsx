import type { Station } from '../model/types';

export type StationLabelProps = {
    station: Station;
};

export default function StationLabel({ station }: StationLabelProps) {
    return <span>{station.name}</span>;
}