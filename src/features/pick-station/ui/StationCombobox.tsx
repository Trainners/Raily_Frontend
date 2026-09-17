import { useEffect, useRef, useState } from 'react';
import styles from './StationCombobox.module.css';

// 보기 모드(선택된 값 또는 placeholder를 보여주는 버튼)와
// 입력 모드(검색 가능한 input + 드롭다운) 두 가지 상태를 오가는 콤보박스
export type StationComboboxProps = {
    label: string;
    value: string;
    placeholder?: string;
    stops: string[];        // entities/station의 STATIONS를 그대로 넘길 예정
    onSelect: (station: string) => void;    // 역 선택 시 콜백
}

export default function StationCombobox({
    label,
    value,
    placeholder = '역을 선택해주세요',
    stops,
    onSelect
}: StationComboboxProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [query, setQuery] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)

    const filteredStops = stops.filter((station) =>
        station.includes(query)
    )

    useEffect(() => {
        // 입력 모드로 바뀌는 즉시 커서가 입력창에 가 있도록 자동 포커스
        if (isEditing) {
            inputRef.current?.focus()
        }
    }, [isEditing])

    const handleStartEditing = () => {
        // 검색창에 기존 선택값을 미리 채워서, 다시 고를 때 처음부터 안 쳐도 되게 함
        setQuery(value)
        setIsEditing(true)
    }

    const handleSelect = (station: string) => {
        onSelect(station)
        setIsEditing(false)
        setQuery('')
    }

    return (
        <div className={styles.container}>
            <span className={styles.label}>{label}</span>

            {isEditing ? (
                <div className={styles.inputWrapper}>
                    <input
                        ref={inputRef}
                        className={styles.input}
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        placeholder={placeholder}
                        type="text"
                    />

                    <div className={styles.optionList}>
                        {filteredStops.length > 0 ? (
                            filteredStops.map((station) => (
                                <button
                                    className={styles.option}
                                    key={station}
                                    type="button"
                                    onMouseDown={() =>
                                        handleSelect(station)
                                    }
                                >
                                    {station}
                                </button>
                            ))
                        ) : (
                            <p className={styles.emptyMessage}>
                                검색 결과가 없습니다.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    className={styles.valueButton}
                    type="button"
                    onClick={handleStartEditing}
                >
                    <span
                        className={
                            value
                                ? styles.selectedValue
                                : styles.placeholder
                        }
                    >
                        {value || placeholder}
                    </span>
                </button>
            )}
        </div>
    )
}