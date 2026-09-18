import { useState } from 'react';
import styles from './TimeSelect.module.css';

// 보기 모드(선택된 시각 또는 placeholder 버튼)와
// 입력 모드(브라우저 기본 time input) 두 가지 상태를 오가는 시각 선택 컴포넌트
export type TimeSelectProps = {
    label: string;
    value: string;          // 'HH:mm' 형식 문자열
    placeholder?: string;
    onChange: (value: string) => void;
};

export default function TimeSelect({
    label,
    value,
    placeholder = '시간을 선택해주세요',
    onChange
}: TimeSelectProps) {
    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        // 시각을 고르면 바로 부모에 반영하고 보기 모드로 복귀
        onChange(event.target.value)
        setIsEditing(false)
    }

    return (
        <div className={styles.container}>
            <span className={styles.label}>{label}</span>

            {isEditing ? (
                <input
                    className={styles.input}
                    type="time"
                    value={value}
                    onChange={handleChange}
                    // 시각을 고르지 않고 다른 곳 클릭해도 보기 모드로 돌아가게 함
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
                        className={value ? styles.selectedValue : styles.placeholder}
                    >
                        {value || placeholder}
                    </span>
                </button>
            )}
        </div>
    )
}