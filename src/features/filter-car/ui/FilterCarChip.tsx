import { Chip } from '../../../shared/ui';
import styles from './FilterCarChip.module.css'

// 호차 필터
export type FilterCarChipProps = {
    carNos: number[];                           // 필터로 보여줄 호차 번호 목록
    selectedCarNo: number | null;               // 현재 선택된 호차, null이면 전체 선택 상태
    onChange: (carNo: number | null) => void;   // 호차 칩 클릭하면 호출, 전체 클릭하면 null 전달
}

export default function FilterCarChip({
    carNos,
    selectedCarNo,
    onChange
}: FilterCarChipProps) {
    return (
        <div className={styles.list}>
            {/* 호차 필터 없을 때 전체 좌석 보여줌 */}
            <Chip
                label="전체"
                selected={selectedCarNo === null}
                onClick={() => onChange(null)}
            />

            {carNos.map((carNo) => (
                <Chip
                    key={carNo}
                    label={`${carNo}호차`}
                    selected={selectedCarNo === carNo}
                    onClick={() => onChange(carNo)}
                />
            ))}
        </div>
    )
}