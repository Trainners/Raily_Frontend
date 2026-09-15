import { Button } from "../../../shared/ui";

export type TakeSeatButtonProps = {
    onTake: () => void;     // 좌석 선택 버튼 눌렀을 때 부모에 알리는 콜백
    disabled?: boolean;     // 버튼 비활성화 여부
};

export default function TakeSeatButton({
    onTake,
    disabled = false,
}: TakeSeatButtonProps) {
    return (
        <Button
            fullWidth
            variant="primary"
            disabled={disabled}
            onClick={onTake}
        >
            이 자리에 앉음
        </Button>
    );
}