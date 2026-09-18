import { useState } from "react";
import styles from './DateSelect.module.css'
import { formatDisplayDate } from "../lib/formatDate";

// 보기 모드(포맷된 날짜 또는 placeholder 버튼)와
// 입력 모드(브라우저 기본 date input) 두 가지 상태를 오가는 날짜 선택 컴포넌트
export type DateSelectProps = {
    label: string;
    value: string;          // 'YYYY-MM-DD' 형식 문자열
    placeholder?: string;
    onChange: (value: string) => void;
}

export default function DateSelect({
    label,
    value,
    placeholder = '날짜를 선택해주세요',
    onChange
}: DateSelectProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        // 날짜를 고르면 바로 부모에 반영하고 보기 모드로 복귀
        onChange(event.target.value)
        setIsEditing(false)
    }

    return (
        <div className={styles.container}>
            <span className={styles.label}>{label}</span>

            {isEditing ? (
                <input
                    className={styles.input}
                    type="date"
                    value={value}
                    onChange={handleChange}
                    // 날짜를 고르지 않고 다른 곳을 클릭해도 보기 모드로 돌아가게 함
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                />
            ) : (
                <button
                    className={styles.trigger}
                    type="button"
                    onClick={() => setIsEditing(true)}
                >
                    <span
                        className={
                            value ? styles.selectedValue : styles.placeholder
                        }
                    >
                        {value ? formatDisplayDate(value) : placeholder}
                    </span>
                </button>
            )}
        </div>
    )
}