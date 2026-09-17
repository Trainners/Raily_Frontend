import { useLogoutMutation } from "../../../entities/user";
import { Button } from "../../../shared/ui";

export type LogoutButtonProps = {
    onLoggedOut: () => void;    // 로그아웃 처리 후 페이지 이동은 부모(페이지) 책임으로 남김(책임범위 구분)
}

export default function LogoutButton({ onLoggedOut }: LogoutButtonProps) {
    const [logout, { isLoading }] = useLogoutMutation();

    const handleClick = async () => {
        try {
            await logout().unwrap();
        } catch {
            // 서버가 거부해도 로컬 인증 상태는 userApi.logout의 onQueryStarted가 이미 비움
        }
        onLoggedOut();
    };

    return (
        <Button
            disabled={isLoading}
            onClick={handleClick}
        >
            {isLoading ? '로그아웃 중...' : '로그아웃'}
        </Button>
    )
}