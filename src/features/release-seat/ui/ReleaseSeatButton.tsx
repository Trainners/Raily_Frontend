import { Button } from "../../../shared/ui";

export type ReleaseSeatButtonProps = {
    onRelease: () => void;      // 자리 비움 버튼 눌렀을 때 부모에 알리는 콜백
    disabled?: boolean;         // 버튼 비활성화 여부
}

export default function ReleaseSeatButton({
    onRelease,
    disabled = false
}: ReleaseSeatButtonProps) {
    return (
        <Button
            variant="ghost"
            disabled={disabled}
            onClick={onRelease}
        >
            자리 비움
        </Button>
    )
}